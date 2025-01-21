import { Request, Response } from 'express';
import { Content } from '../../models/content';
import { AppDataSource } from '../../config';
import { ResponseHandler } from '../../utils/responseHandler';
import httpStatus from 'http-status';
import { Question } from '../../models/question';
import { Op } from 'sequelize';

const standardiseMediaKeys = async (req: Request, res: Response) => {
  const contents = await Content.findAll();
  const questionsWithImages = await Question.findAll({
    where: {
      question_body: {
        question_image: {
          [Op.ne]: null,
        },
      },
    },
  });

  const transaction = await AppDataSource.transaction();
  const promises = [];

  for (const content of contents) {
    const media = (content.media || [])
      .filter((v) => !!v)
      .map((media: any) => ({
        src: media.src,
        fileName: media.fileName ?? media.file_name,
        mimeType: media.mimeType ?? media.mime_type,
        mediaType: media.mediaType ?? media.media_type,
      }));
    promises.push(content.update({ media }, { transaction }));
  }

  for (const question of questionsWithImages) {
    const { question_body } = question;
    const { question_image } = question_body as any;
    if (question_image) {
      promises.push(
        question.update(
          {
            question_body: {
              ...(question.question_body || {}),
              question_image: {
                src: question_image.src,
                fileName: question_image.fileName ?? question_image.file_name,
                mimeType: question_image.mimeType ?? question_image.mime_type,
                mediaType: question_image.mediaType ?? question_image.media_type,
              },
            },
          },
          { transaction },
        ),
      );
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

export default standardiseMediaKeys;
