import express from 'express';
import createQuestionSetQuestionMapping from '../controllers/dataMigrations/createQuestionSetQuestionMapping';
import updateQuestionSetXId from '../controllers/dataMigrations/updateQuestionSetXId';
import standardiseMediaKeys from '../controllers/dataMigrations/standardiseMediaKeys';
import updateGrid1MetaData from '../controllers/dataMigrations/updateGrid1MetaData';
import createSections from '../controllers/dataMigrations/createSections';
import updateLearnerNamesAndSchool from '../controllers/dataMigrations/updateLearnerNamesAndSchool';
import updateQuestionAudioDescription from '../controllers/dataMigrations/updateQuestionAudioDescription';
import generateAudioForDescriptions from '../controllers/dataMigrations/generateAudioForDescriptions';
import createAudioQuestionMapping from '../controllers/dataMigrations/createAudioQuestionMapping';
import updateQuestionTextAndDescription from '../controllers/dataMigrations/updateQuestionTextAndDescription';
import createTelanganaLearners from '../controllers/dataMigrations/createTelanganaLearners';
import initializeQuestionMetaTable from '../controllers/dataMigrations/initializeQuestionMetaTable';
import initializeSubTopicHierarchyTable from '../controllers/dataMigrations/initializeSubTopicHierarchyTable';
import initializeSubTopicNQLTypeTable from '../controllers/dataMigrations/initializeSubTopicNQLTypeTable';
import initializeAccuracyThresholdsTable from '../controllers/dataMigrations/initializeAccuracyThresholdsTable';
import initializeSubTopicMasterTable from '../controllers/dataMigrations/initializeSubTopicMasterTable';
import initializeSubSkillMasterTable from '../controllers/dataMigrations/initializeSubSkillMasterTable';
import initializeSubSkillValuesTable from '../controllers/dataMigrations/initializeSubSkillValuesTable';
import initializePrimarySkillCombinationsTable from '../controllers/dataMigrations/initializePrimarySkillCombinationsTable';
import initializeSequentialNQLDetailsTable from '../controllers/dataMigrations/initializeSequentialNQLDetailsTable';
import initializeAccuracyThresholdBasedNQLDetailsTable from '../controllers/dataMigrations/initializeAccuracyThresholdBasedNQLDetailsTable';
import initializeSubTopicIdsAndQuestionGroupId from '../controllers/dataMigrations/initializeSubTopicIdsAndQuestionGroupId';

export const dataMigrations = express.Router();

dataMigrations.post('/question-set-question-mapping', createQuestionSetQuestionMapping);

dataMigrations.post('/update-qs-x_id', updateQuestionSetXId);

dataMigrations.post('/media-keys-fix', standardiseMediaKeys);

dataMigrations.post('/grid-1-metadata', updateGrid1MetaData);

dataMigrations.post('/create-sections', createSections);

dataMigrations.post('/update-learner-names-and-school', updateLearnerNamesAndSchool);

dataMigrations.post('/update-audio-description', updateQuestionAudioDescription);

dataMigrations.post('/generate-audio-for-descriptions', generateAudioForDescriptions);

dataMigrations.post('/create-audio-question-mapping', createAudioQuestionMapping);

dataMigrations.post('/update-question-text-and-description', updateQuestionTextAndDescription);

dataMigrations.post('/create-telangana-learners', createTelanganaLearners);

// ******** NQL APIS **********
dataMigrations.post('/initialize-sub-topic-master-table', initializeSubTopicMasterTable);

dataMigrations.post('/initialize-sub-topic-hierarchy-table', initializeSubTopicHierarchyTable);

dataMigrations.post('/initialize-sub-topic-nql-type-table', initializeSubTopicNQLTypeTable);

dataMigrations.post('/initialize-sequential-nql-details-table', initializeSequentialNQLDetailsTable);

dataMigrations.post('/initialize-accuracy-threshold-based-nql-details-table', initializeAccuracyThresholdBasedNQLDetailsTable);

dataMigrations.post('/initialize-accuracy-thresholds-table', initializeAccuracyThresholdsTable);

dataMigrations.post('/initialize-sub-skill-master-table', initializeSubSkillMasterTable);

dataMigrations.post('/initialize-sub-skill-values-table', initializeSubSkillValuesTable);

dataMigrations.post('/initialize-primary-skill-combinations-table', initializePrimarySkillCombinationsTable);

dataMigrations.post('/initialize-question-meta-table', initializeQuestionMetaTable);

dataMigrations.post('/initialize-sub-topic-ids-and-question-group-id', initializeSubTopicIdsAndQuestionGroupId);
