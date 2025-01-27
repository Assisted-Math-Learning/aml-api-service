import * as _ from 'lodash';
import { FIBType } from '../../enums/fibType';
import { QuestionType } from '../../enums/questionType';
import { amlError } from '../../types/amlError';
import logger from '../../utils/logger';
import { replaceAt } from '../../utils/string.util';

const getCarryValues = (n1: string, n2: string) => {
  const maxLength = Math.max(n1.length, n2.length);
  const n1Str = n1.padStart(maxLength, '0');
  const n2Str = n2.padStart(maxLength, '0');

  let i = maxLength - 1;
  const carries = [];
  let lastCarry = 0;
  while (i > 0) {
    const num1 = +n1Str[i];
    const num2 = +n2Str[i];
    if (num1 + num2 + lastCarry > 9) {
      carries.unshift(1);
      lastCarry = 1;
    } else {
      lastCarry = 0;
      carries.unshift(0);
    }
    i--;
  }

  return carries;
};

const addGrid1Answer = (input: any) => {
  const { grid_fib_n1, grid_fib_n2, grid1_pre_fills_top, grid1_pre_fills_result, grid1_show_carry } = input;

  const n1 = parseInt(grid_fib_n1);
  const n2 = parseInt(grid_fib_n2);

  const result = n1 + n2;
  const resultStr = result.toString();
  let isPrefil = grid1_show_carry === 'yes';
  let errorMsg = '';
  let answerResult = '';

  const carries = getCarryValues(grid_fib_n1, grid_fib_n2);
  const validCarries = carries.filter((v) => !!v);

  if (validCarries.length !== grid1_pre_fills_top.length) {
    errorMsg = 'Incorrect grid1_pre_fills_top';
  }

  if (resultStr.length !== grid1_pre_fills_result.length) {
    errorMsg = 'Incorrect grid1_pre_fills_result';
  }

  if (errorMsg) {
    const errorContext = `grid_fib_n1 = ${grid_fib_n1} & grid_fib_n2 = ${grid_fib_n2}`;
    throw new Error(`${errorMsg} :: ${errorContext}`);
  }

  const answerTop: string[] = carries.map((val) => (val === 0 ? '#' : '1'));

  if (isPrefil) {
    isPrefil = !answerTop.every((item: string) => item === '#');
  }

  if (isPrefil) {
    const fillableIndicesOfAnswerTop = answerTop.reduce((agg: number[], curr, index) => {
      if (curr !== '#') {
        agg.push(index);
      }
      return agg;
    }, []);

    for (let i = 0; i < fillableIndicesOfAnswerTop.length; i++) {
      const indexOfAnswerTop = fillableIndicesOfAnswerTop[i];
      if (grid1_pre_fills_top[i] === 'B') {
        answerTop[indexOfAnswerTop] = 'B';
      }
    }
  }

  for (let i = resultStr.length - 1; i >= 0; i--) {
    if (grid1_pre_fills_result[i] === 'B') {
      answerResult += 'B';
    } else {
      answerResult += resultStr[i];
    }
  }

  return {
    result: parseInt(resultStr),
    isPrefil,
    answerTop: answerTop.join(''),
    answerResult: answerResult.split('').reverse().join(''),
  };
};

const addFIBAnswer = (input: any) => {
  const { grid_fib_n1, grid_fib_n2, fib_type, fib_answer } = input;

  if (fib_type === FIBType.FIB_STANDARD_WITH_IMAGE) {
    return {
      result: fib_answer,
      fib_type,
    };
  }

  return {
    result: parseInt(grid_fib_n1) + parseInt(grid_fib_n2),
    fib_type,
  };
};

const addPaddingToDifference = (n1: number, n2: number) => {
  return !(n1.toString().length === 2 && n2.toString().length === 1 && (n1 - n2).toString().length === 1);
};

const borrowAndReturnNewNumber = (num: string, currentIndex: number) => {
  let numStr = num;
  const numOnLeft = +numStr[currentIndex - 1];
  if (numOnLeft > 0) {
    numStr = replaceAt(numStr, currentIndex - 1, `${numOnLeft - 1}`);
    return numStr;
  }

  return borrowAndReturnNewNumber(replaceAt(numStr, currentIndex - 1, '9'), currentIndex - 1);
};

const getSubGrid1AnswerTop = (n1: number, n2: number): string[] => {
  const originalN1Str = n1.toString();
  let n1Str = n1.toString();

  const L = n1Str.length;

  const n2Str = n2.toString().padStart(L, '0');

  const result = Array(L).fill('#');

  for (let i = L - 1; i >= 0; i--) {
    const num1 = +n1Str[i];
    const num2 = +n2Str[i];
    if (num1 < num2) {
      result[i] = num1 + 10;
      n1Str = borrowAndReturnNewNumber(n1Str, i);
      result[i] = `${num1 + 10}`;
      result[i - 1] = n1Str[i - 1];
    } else if (originalN1Str[i] !== n1Str[i]) {
      result[i] = n1Str[i];
    }
  }
  return result;
};

const subGrid1Answer = (input: any) => {
  const { grid_fib_n1, grid_fib_n2, grid1_pre_fills_top, grid1_pre_fills_result, grid1_show_regroup } = input;

  const maxLength = Math.max(grid_fib_n1.length, grid_fib_n2.length);
  const n1Str = grid_fib_n1.padStart(maxLength, '0');
  const n2Str = grid_fib_n2.padStart(n1Str.length, '0');
  let result = 0;
  let answerResult = '';
  let isPrefil = grid1_show_regroup === 'yes';
  const addPaddingToResult = addPaddingToDifference(grid_fib_n1, grid_fib_n2);
  let errorMsg = '';

  result = parseInt(n1Str) - parseInt(n2Str);

  const answerTop: string[] = getSubGrid1AnswerTop(n1Str, n2Str);
  if (isPrefil) {
    isPrefil = !answerTop.every((item: string) => item === '#');
  }

  if (isPrefil) {
    const fillableIndicesOfAnswerTop = answerTop.reduce((agg: number[], curr, index) => {
      if (curr !== '#') {
        agg.push(index);
      }
      return agg;
    }, []);

    if (fillableIndicesOfAnswerTop.length === grid1_pre_fills_top.length) {
      for (let i = 0; i < fillableIndicesOfAnswerTop.length; i++) {
        const indexOfAnswerTop = fillableIndicesOfAnswerTop[i];
        if (grid1_pre_fills_top[i] === 'B') {
          answerTop[indexOfAnswerTop] = 'B';
        }
      }
    } else {
      errorMsg = 'Incorrect grid1_pre_fills_top';
    }
  }

  let resultStr = result.toString();

  resultStr = addPaddingToResult ? resultStr.padStart(n1Str.length, '0') : resultStr;

  if (resultStr.length !== grid1_pre_fills_result.length) {
    errorMsg = 'Incorrect grid1_pre_fills_result';
  }

  if (errorMsg) {
    const code = 'QUESTION_INVALID_INPUT';
    logger.error({ code, errorMsg });
    throw amlError(code, errorMsg, 'BAD_REQUEST', 400);
  }

  for (let i = resultStr.length - 1; i >= 0; i--) {
    if (grid1_pre_fills_result[i] === 'B') {
      answerResult += 'B';
    } else {
      answerResult += resultStr[i];
    }
  }

  return {
    result: resultStr,
    isPrefil,
    answerTop: answerTop.join('|'),
    answerResult: answerResult.split('').reverse().join(''),
  };
};

const subFIBAnswer = (input: any) => {
  const { grid_fib_n1, grid_fib_n2, fib_type, fib_answer } = input;

  if (fib_type === FIBType.FIB_STANDARD_WITH_IMAGE) {
    return {
      result: fib_answer,
      fib_type,
    };
  }

  return {
    result: parseInt(grid_fib_n1) - parseInt(grid_fib_n2),
    fib_type,
  };
};

const multiplicationGrid1Answer = (input: any) => {
  const { grid_fib_n1, grid_fib_n2, grid1_multiply_intermediate_steps_prefills, grid1_pre_fills_result } = input;

  const isIntermediatePrefill = grid_fib_n2.toString().length > 1;
  const intermediateStepPrefills: string[] = grid1_multiply_intermediate_steps_prefills?.split('#');

  let errorMsg = '';
  const answers: string[] = [];
  const actualResult = grid_fib_n1 * grid_fib_n2;

  if (isIntermediatePrefill) {
    let factor = 1;
    let num2Copy = grid_fib_n2;

    while (num2Copy > 0) {
      const lastDigit = num2Copy % 10;
      const product = lastDigit * grid_fib_n1 * factor;
      const answer = product === 0 ? product.toString().padStart(grid_fib_n1.toString().length + Math.log10(factor), '0') : product.toString();
      answers.unshift(answer);
      factor *= 10;
      num2Copy = Math.floor(num2Copy / 10);
    }

    // Validate lengths
    if (answers.length !== intermediateStepPrefills.length) {
      errorMsg = 'Incorrect grid1_multiply_intermediate_steps_prefills';
    }

    for (let i = 0; i < intermediateStepPrefills.length; i++) {
      if (answers[i].length !== intermediateStepPrefills[i].length) {
        errorMsg = 'Incorrect grid1_multiply_intermediate_steps_prefills';
      }
    }
  }

  if (actualResult.toString().length !== grid1_pre_fills_result.length) {
    errorMsg = 'Incorrect grid1_pre_fills_result';
  }

  if (errorMsg) {
    const code = 'QUESTION_INVALID_INPUT';
    logger.error({ code, errorMsg });
    throw amlError(code, errorMsg, 'BAD_REQUEST', 400);
  }

  const answerIntermediateRaw = answers.join('#');
  const answerIntermediate = grid1_multiply_intermediate_steps_prefills.split('');

  for (let i = 0; i < answerIntermediate.length; i++) {
    if (answerIntermediate[i] === 'F') {
      answerIntermediate[i] = answerIntermediateRaw[i];
    }
  }

  const answerResultString = grid1_pre_fills_result
    .split('')
    .map((char: string, index: number) => (char === 'F' ? actualResult.toString()[index] : char))
    .join('');

  return {
    isIntermediatePrefill,
    answerIntermediate: answerIntermediate.join('').split('#').reverse().join('#'),
    result: actualResult,
    answerResult: answerResultString,
  };
};

const multiplicationFIBAnswer = (input: any) => {
  const { grid_fib_n1, grid_fib_n2, fib_type, fib_answer } = input;

  if (fib_type === FIBType.FIB_STANDARD_WITH_IMAGE) {
    return {
      result: fib_answer,
      fib_type,
    };
  }

  return {
    result: parseInt(grid_fib_n1) * parseInt(grid_fib_n2),
    fib_type,
  };
};

const getDivGrid1IntermediateStepsQuotientAndRemainder = (n1: number, n2: number) => {
  const n1Str = n1.toString();
  const answers: string[] = [];
  const answersWithPadding: string[] = [];
  let currentNumber = 0;
  let k = 0;
  let lastDifferenceValue = '';
  let lastSubN1 = 0;
  let lastSubN2 = 0;
  for (let i = 0; i < n1Str.length && k < n1Str.length; i++) {
    if (lastDifferenceValue !== '' && +lastDifferenceValue === 0 && +n1Str[k] < n2) {
      answers.push(lastDifferenceValue + n1Str[k]);
      answersWithPadding.push(answers[answers.length - 1].toString().padStart(k + 1, '#'));
      answers.push('0');
      answersWithPadding.push(answers[answers.length - 1].toString().padStart(k + 1, '#'));
      lastSubN1 = Number(lastDifferenceValue + n1Str[k]);
      lastSubN2 = 0;
      lastDifferenceValue = n1Str[k];
      currentNumber = +lastDifferenceValue;
      k++;
      continue;
    }
    let skipSlice = false;
    if (lastDifferenceValue !== '' && +lastDifferenceValue === 0) {
      skipSlice = true;
    }
    if (i === 0) {
      while (currentNumber < n2 && k < n1Str.length) {
        currentNumber = currentNumber * 10 + +n1Str[k++];
      }
    } else if (k < n1Str.length) {
      if (currentNumber < n2) {
        currentNumber = currentNumber * 10 + +n1Str[k];
      }
      if (currentNumber < n2) {
        answers.push(lastDifferenceValue + n1Str[k]);
        answersWithPadding.push(answers[answers.length - 1].toString().padStart(k + 1, '#'));
        answers.push('0');
        answersWithPadding.push(answers[answers.length - 1].toString().padStart(k + 1, '#'));
        lastSubN1 = Number(lastDifferenceValue + n1Str[k]);
        lastSubN2 = 0;
        lastDifferenceValue = Number(lastDifferenceValue + n1Str[k]).toString();
        currentNumber = +lastDifferenceValue;
        k++;
        continue;
      } else {
        k++;
      }
    }
    if (i > 0) {
      const finalCurrentNumber = lastDifferenceValue + currentNumber.toString().slice(skipSlice ? 0 : Number(lastDifferenceValue).toString().length);
      answers.push(finalCurrentNumber);
      answersWithPadding.push(answers[answers.length - 1].toString().padStart(k, '#'));
    }
    const closestMultiple = Math.floor(currentNumber / n2) * n2;
    answers.push(closestMultiple.toString());
    answersWithPadding.push(answers[answers.length - 1].toString().padStart(k, '#'));
    const difference = (currentNumber - closestMultiple).toString();
    lastDifferenceValue = addPaddingToDifference(currentNumber, closestMultiple) ? difference.padStart(currentNumber.toString().length, '0') : difference;
    lastSubN1 = currentNumber;
    lastSubN2 = closestMultiple;
    currentNumber = +difference;
  }

  const remainder = (lastSubN1 - lastSubN2).toString();

  return {
    intermediateSteps: answers,
    intermediateStepsWithPadding: answersWithPadding,
    quotient: Math.floor(n1 / n2).toString(),
    remainder: addPaddingToDifference(lastSubN1, lastSubN2) ? remainder.padStart(lastSubN1.toString().length, '0') : remainder,
  };
};

const getPaddedInterMediateStepsPattern = (intermediateSteps: string[], intermediateStepsWithPadding: string[]) => {
  const finalAns: string[] = [];

  for (let i = 0; i < intermediateSteps.length; i++) {
    finalAns.push(intermediateSteps[i].padStart(intermediateStepsWithPadding[i].length, '#'));
  }

  return finalAns.join('|');
};

const divisionGrid1Answer = (input: any) => {
  const { grid_fib_n1, grid_fib_n2, grid1_pre_fills_quotient, grid1_pre_fills_remainder, grid1_div_intermediate_steps_prefills } = input;
  let errorMsg = '';

  const { intermediateSteps, intermediateStepsWithPadding, quotient, remainder } = getDivGrid1IntermediateStepsQuotientAndRemainder(grid_fib_n1, grid_fib_n2);

  // Validate Intermediate Prefills
  const intermediatePrefills = (grid1_div_intermediate_steps_prefills || '').split('#').reverse();

  if (
    intermediateSteps.length !== intermediatePrefills.length ||
    !Array(intermediateSteps.length)
      .fill(0)
      .every((_, index) => intermediateSteps[index].length === intermediatePrefills[index].length)
  ) {
    errorMsg = 'Incorrect grid1_div_intermediate_steps_prefills';
  }

  // Validate Quotient Prefills
  if (!errorMsg && quotient.length !== grid1_pre_fills_quotient.length) {
    errorMsg = 'Incorrect grid1_pre_fills_quotient';
  }

  // Validate Remainder Prefills
  if (!errorMsg && remainder.length !== grid1_pre_fills_remainder.length) {
    errorMsg = 'Incorrect grid1_pre_fills_remainder';
  }

  if (errorMsg) {
    const code = 'QUESTION_INVALID_INPUT';
    logger.error({ code, errorMsg });
    throw amlError(code, errorMsg, 'BAD_REQUEST', 400);
  }

  const intermediatePrefillsReverse = ((grid1_div_intermediate_steps_prefills as string) || '').split('#').reverse().join('|');
  let intermediateStepsPattern = intermediateSteps.join('|');

  for (let i = 0; i < intermediateStepsPattern.length; i++) {
    if (intermediatePrefillsReverse[i] === 'B') {
      intermediateStepsPattern = replaceAt(intermediateStepsPattern, i, 'B');
    }
  }

  let answerQuotient = quotient;
  for (let i = 0; i < grid1_pre_fills_quotient.length; i++) {
    if (grid1_pre_fills_quotient[i] === 'B') {
      answerQuotient = replaceAt(answerQuotient, i, 'B');
    }
  }

  let answerRemainder = remainder;
  for (let i = 0; i < grid1_pre_fills_remainder.length; i++) {
    if (grid1_pre_fills_remainder[i] === 'B') {
      answerRemainder = replaceAt(answerRemainder, i, 'B');
    }
  }

  return {
    answerIntermediate: getPaddedInterMediateStepsPattern(intermediateStepsPattern.split('|'), intermediateStepsWithPadding), // padding the steps with '#' for proper alignment from LHS
    answerQuotient,
    answerRemainder: answerRemainder.padStart(grid_fib_n1.toString().length, '#'), // padding the answer with '#' for proper alignment from LHS
    result: {
      quotient,
      remainder,
    },
  };
};

const divisionFIBAnswer = (input: any) => {
  const { grid_fib_n1, grid_fib_n2, fib_type, fib_answer } = input;

  if ([FIBType.FIB_STANDARD_WITH_IMAGE, FIBType.FIB_QUOTIENT_REMAINDER_WITH_IMAGE].includes(fib_type)) {
    return {
      result: fib_answer,
      fib_type,
    };
  }

  let result: any = Math.floor(parseInt(grid_fib_n1) / parseInt(grid_fib_n2));

  if (fib_type === FIBType.FIB_QUOTIENT_REMAINDER) {
    result = {
      quotient: Math.floor(parseInt(grid_fib_n1) / parseInt(grid_fib_n2)),
      remainder: parseInt(grid_fib_n1) % parseInt(grid_fib_n2),
    };
  }

  return {
    result,
    fib_type,
  };
};

const getAnswer = (skill: string, question_type: QuestionType, bodyObject: any) => {
  if (question_type === QuestionType.FIB) {
    const { fib_type, fib_answer, question_image } = bodyObject;
    let errorMsg = '';
    if ([FIBType.FIB_STANDARD_WITH_IMAGE, FIBType.FIB_QUOTIENT_REMAINDER_WITH_IMAGE].includes(fib_type) && !question_image) {
      errorMsg = 'Missing question_image';
    }
    if ([FIBType.FIB_STANDARD_WITH_IMAGE, FIBType.FIB_QUOTIENT_REMAINDER_WITH_IMAGE].includes(fib_type) && !fib_answer) {
      errorMsg = 'Missing fib_answer';
    }
    if (errorMsg) {
      const code = 'QUESTION_INVALID_INPUT';
      logger.error({ code, errorMsg });
      throw amlError(code, errorMsg, 'BAD_REQUEST', 400);
    }
  }
  switch (`${skill}_${question_type}`) {
    case 'Addition_Grid-1':
      return addGrid1Answer(bodyObject);
    case 'Addition_Fib':
      return addFIBAnswer(bodyObject);

    case 'Subtraction_Grid-1':
      return subGrid1Answer(bodyObject);
    case 'Subtraction_Fib':
      return subFIBAnswer(bodyObject);

    case 'Multiplication_Grid-1':
      return multiplicationGrid1Answer(bodyObject);
    case 'Multiplication_Fib':
      return multiplicationFIBAnswer(bodyObject);

    case 'Division_Grid-1':
      return divisionGrid1Answer(bodyObject);
    case 'Division_Fib':
      return divisionFIBAnswer(bodyObject);

    default:
      return undefined;
  }
};

export const getQuestionBody = (data: any) => {
  const { question_type, operation, question_body } = data;
  const { numbers, fib_type, question_image, options, correct_option } = question_body;

  const questionBody = question_body;

  if ([QuestionType.GRID_1, QuestionType.GRID_2].includes(question_type) && numbers) {
    _.set(questionBody, ['numbers'], numbers);
  }

  if (question_type === QuestionType.FIB && fib_type) {
    if ([FIBType.FIB_STANDARD, FIBType.FIB_QUOTIENT_REMAINDER].includes(fib_type) && numbers) {
      _.set(questionBody, ['numbers'], numbers);
    }
    if ([FIBType.FIB_STANDARD_WITH_IMAGE, FIBType.FIB_QUOTIENT_REMAINDER_WITH_IMAGE].includes(fib_type) && question_image) {
      _.set(questionBody, ['question_image'], question_image);
    }
  }

  if (question_type === QuestionType.MCQ) {
    _.set(questionBody, ['options'], options);
    _.set(questionBody, ['correct_option'], correct_option);
    if (question_image) {
      _.set(questionBody, ['question_image'], question_image);
    }
  }

  const answers = getAnswer(operation, question_type, { ...question_body, grid_fib_n1: numbers?.n1?.toString(), grid_fib_n2: numbers?.n2?.toString() });

  _.set(questionBody, 'answers', answers);

  return questionBody;
};
