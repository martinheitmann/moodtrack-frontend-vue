import { ItemType } from "./InAppQuestionnaireQuestionTypes";

export function createList(freeTextQuestions, multiChoiceQuestions) {
  if (freeTextQuestions && multiChoiceQuestions) {
    const allItems = [];
    for (const item of freeTextQuestions) {
      const _item = mapFreeText(item);
      _item.type = ItemType.FREE_TEXT;
      allItems.push(_item);
    }

    for (const item of multiChoiceQuestions) {
      const _item = mapMultiChoice(item);
      _item.type = ItemType.MULTI_CHOICE;
      allItems.push(_item);
    }
    return allItems.sort((a, b) => a.index - b.index);
  }
  throw new Error("One or more arguments were undefined or null.");
}

function mapFreeText(arg) {
  return {
    index: arg.index,
    question: arg.question,
  };
}

function mapMultiChoice(arg) {
  return {
    index: arg.index,
    question: arg.question,
    choices: arg.choices.map((choice) => {
      return {
        display: choice.display,
        value: choice.value,
        type: choice.type,
      };
    }),
  };
}

export function createChoice(display, value, type) {
  return {
    display: display,
    value: value,
    type: type,
  };
}

export function constructQuestionnaireMutationData(questionnaireId, items) {
  console.log("constructQuestionnaireMutationData called.");
  const indexedItems = setIndex(items);
  const freeTextItems = indexedItems
    .filter((i) => i.type === ItemType.FREE_TEXT)
    .map((i) => {
      return { question: i.question, index: i.index };
    });
  const multiChoiceItems = indexedItems
    .filter((i) => i.type === ItemType.MULTI_CHOICE)
    .map((i) => {
      return {
        question: i.question,
        index: i.index,
        choices: i.choices,
      };
    });
  const ret = {
    creationDate: new Date(),
    questionnaireId: questionnaireId,
    multipleChoiceItems: multiChoiceItems,
    freeTextItems: freeTextItems,
  };
  console.log("Result: " + JSON.stringify(ret));
  return ret;
}

function setIndex(items) {
  const indexedItems = [];
  items.forEach(function(item, index) {
    const _item = item;
    item.index = index;
    indexedItems.push(_item);
  });
  return indexedItems;
}
