/*
 Helper funcations to clean up code.
 TODO: find a way to make this _getSum generic wtih BoxList _getSum
 TODO: instead of fetching objcts, only fetch ids
*/

export const getSum1 = (valueList) => {
  /*
  Return arregate value of items/boxes/moves.
  */
  let _valueList = null;

  if (!valueList.length) return 0;

  if (valueList && valueList[0].value) {
    _valueList = valueList.map((item) => item.value);
  }

  return _valueList.reduce((acc, curr) => acc + curr, 0);
};

export const getSum2 = (valueList) => {
  /*
  Using .reduce on list of objects results with incorrect sum values.
  */

  if (!valueList.length) return 0;

  const numList = valueList.map((item) => item.value);

  return numList.reduce((acc, curr) => acc + curr, 0);
};

export const getSum3 = (valueList) => {
  /*
  Using .reduce on list of objects results with incorrect sum values.
  */

  if (!valueList.length) return 0;

  return valueList.reduce((acc, curr) => acc + curr, 0);
};
