import { Request, Response } from 'express';
import { ResponseHandler } from '../../utils/responseHandler';
import httpStatus from 'http-status';
import * as _ from 'lodash';
import { amlError } from '../../types/amlError';
import papaparse from 'papaparse';
import appRootPath from 'app-root-path';
import path from 'path';
import fs from 'node:fs';
import { AppDataSource } from '../../config';
import { QuestionSet } from '../../models/questionSet';
import { Op } from 'sequelize';
import { Content } from '../../models/content';
import { Question } from '../../models/question';
import { QuestionSetQuestionMapping } from '../../models/questionSetQuestionMapping';

const getCSVEntries = (csvFile: any) => {
  const filePath = path.join(appRootPath.path, 'temporary', `data.csv`);
  fs.writeFileSync(filePath, csvFile.data);
  const localCSVFile = fs.readFileSync(filePath, 'utf-8');
  const csvRows = papaparse.parse(localCSVFile)?.data;
  fs.unlinkSync(filePath);
  return csvRows as string[][];
};

const updateQuestionSetXId = async (req: Request, res: Response) => {
  const csvFile = _.get(req, ['files', 'document'], {});
  const tableName = _.get(req, ['body', 'table_name'], '');
  if (!csvFile || !tableName) {
    const code = 'UPLOAD_INVALID_INPUT';
    throw amlError(code, 'document or table_name missing', 'BAD_REQUEST', 400);
  }

  const rows = getCSVEntries(csvFile);
  const transaction = await AppDataSource.transaction();
  const promises: any = [];
  const repositoryNameHeaderIndex = rows[0].findIndex((item) => item === 'repository_name');
  const l1SkillHeaderIndex = rows[0].findIndex((item) => item === 'l1_skill');
  const repositoryName = rows[1][repositoryNameHeaderIndex];
  const l1SkillName = rows[1][l1SkillHeaderIndex];
  switch (tableName) {
    case 'question_set': {
      const sequenceHeaderIndex = rows[0].findIndex((item) => item === 'sequence');
      const ignoreIds: number[] = [];
      for (const row of rows.slice(1)) {
        const [questionSetId, questionSetTitle] = row;
        const sequence = row[sequenceHeaderIndex];
        const questionSet = await QuestionSet.findOne({
          where: {
            id: {
              [Op.notIn]: ignoreIds,
            },
            sequence,
            x_id: null,
            title: {
              en: questionSetTitle,
            },
            repository: {
              name: {
                en: repositoryName,
              },
            },
            taxonomy: {
              l1_skill: {
                name: {
                  en: l1SkillName,
                },
              },
            },
          },
        });
        if (questionSet) {
          promises.push(questionSet.update({ x_id: questionSetId }, { transaction }));
          ignoreIds.push(questionSet.id);
        }
      }
      break;
    }
    case 'content': {
      const mediaFileHeaderIndex = rows[0].findIndex((item) => item === 'media_file');
      const ignoreIds: number[] = [];
      for (const row of rows.slice(1)) {
        const [contentId, contentTitle] = row;
        const mediaFileName = row[mediaFileHeaderIndex];
        const content = await Content.findOne({
          where: {
            id: {
              [Op.notIn]: ignoreIds,
            },
            x_id: null,
            name: {
              en: contentTitle,
            },
            repository: {
              name: {
                en: repositoryName,
              },
            },
            taxonomy: {
              l1_skill: {
                name: {
                  en: l1SkillName,
                },
              },
            },
            media: {
              [Op.contains]: [{ fileName: mediaFileName }],
            },
          },
        });
        if (content) {
          promises.push(content.update({ x_id: contentId }, { transaction }));
          ignoreIds.push(content.id);
        }
      }
      break;
    }
    case 'question': {
      const questionSetXIDIdentifierMapping = {};
      for (const row of rows.slice(1)) {
        const [questionId, questionSetId, sequence] = row;
        let questionSetIdentifier = _.get(questionSetXIDIdentifierMapping, questionSetId);
        if (!questionSetIdentifier) {
          const questionSet = await QuestionSet.findOne({
            where: {
              x_id: questionSetId,
              repository: {
                name: {
                  en: repositoryName,
                },
              },
              taxonomy: {
                l1_skill: {
                  name: {
                    en: l1SkillName,
                  },
                },
              },
            },
          });
          if (questionSet) {
            questionSetIdentifier = questionSet.identifier;
            _.set(questionSetXIDIdentifierMapping, questionSetId, questionSetIdentifier);
          }
        }
        if (questionSetIdentifier) {
          const mapping = await QuestionSetQuestionMapping.findOne({
            where: {
              question_set_id: questionSetIdentifier,
              sequence,
            },
          });
          if (mapping) {
            const questionIdentifier = mapping.question_id;
            promises.push(Question.update({ x_id: questionId }, { where: { identifier: questionIdentifier }, transaction }));
          }
        }
      }
      break;
    }
    default: {
      const code = 'INVALID_TABLE_NAME';
      throw amlError(code, 'Invalid table_name', 'BAD_REQUEST', 400);
    }
  }

  try {
    await Promise.all(promises);
    await transaction.commit();
  } catch (e) {
    await transaction.rollback();
  }
  ResponseHandler.successResponse(req, res, { status: httpStatus.OK, data: { success: true } });
};

export default updateQuestionSetXId;
