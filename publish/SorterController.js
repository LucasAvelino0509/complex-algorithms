import Event from './objects/Event';
import Render from './Render';
import { EventType } from './objects/Event';
import SorterConfig from './objects/Sorter';
export const Sorters = {
  Bubble: new SorterConfig(0, 'Bubble Sort', 'bubbleSort'),
  Insertion: new SorterConfig(1, 'Insertion Sort', 'insertionSort'),
  Quick: new SorterConfig(2, 'Quick Sort', 'quickSort'),
  Merge: new SorterConfig(3, 'Merge Sort', 'mergeSort')
};
export class SorterLogic extends Render {
  array = [];
  eventPool = [];
  timeInExec = 0;

  constructor(element) {
    super(element);
  }

  addEvent = async (eventType, data) => {
    this.eventPool.push(new Event(eventType, data));
  };
  bubbleSort = () => {
    this.timeInExec = -performance.now();

    try {
      let arrayHoldedState = [...this.array];

      for (let i = 0; i < this.array.length; i++) {
        for (let j = 0; j < this.array.length - i; j++) {
          if (this.array[i] && this.array[j + 1] && this.array[j].value > this.array[j + 1].value) {
            const aux = this.array[j];
            this.array[j] = this.array[j + 1];
            this.array[j + 1] = aux;
            this.addEvent(EventType.Movement, {
              initialState: arrayHoldedState,
              endState: { ...this.array
              }
            });
          }

          arrayHoldedState = [...this.array];
        }
      }
    } catch (error) {
      return;
    } // await this.render(this.array);


    this.timeInExec += performance.now();
    this.prepareRender(this.eventPool);
    return this;
  };
  insertionSort = () => {
    let insertion = () => {
      try {
        for (let i = 0; i < this.array.length; i++) {
          const key = this.array[i];
          let arrayHoldedState = [...this.array];
          let j = i - 1;

          while (j >= 0 && this.array[j].value > key.value) {
            this.array[j + 1] = this.array[j];
            j = j - 1;
            this.addEvent(EventType.Movement, {
              initialState: arrayHoldedState,
              endState: { ...this.array
              }
            });
            arrayHoldedState = [...this.array];
          }

          this.array[j + 1] = key;
          this.addEvent(EventType.Movement, {
            initialState: arrayHoldedState,
            endState: { ...this.array
            }
          });
          arrayHoldedState = [...this.array];
        }
      } catch (error) {
        return;
      }
    };

    this.timeInExec = -performance.now();
    insertion();
    this.timeInExec += performance.now();
    this.prepareRender(this.eventPool);
    return this;
  };
  quickSort = () => {
    try {
      const quick = (lo, hi) => {
        if (lo < hi) {
          let p = particiona(lo, hi);
          quick(lo, p - 1);
          quick(p + 1, hi);
        }
      };

      const particiona = (lo, hi) => {
        let pivot = this.array[hi];
        this.timeInExec += performance.now();
        let arrayHoldedState = { ...this.array
        };
        this.timeInExec -= performance.now();
        let i = lo;

        for (let j = lo; j <= hi; j++) {
          if (this.array[j].value < pivot.value) {
            const aux = this.array[i];
            this.array[i] = this.array[j];
            this.array[j] = aux; // console.time("[add-event][118]");

            this.timeInExec += performance.now();
            this.addEvent(EventType.Movement, {
              initialState: arrayHoldedState,
              endState: { ...this.array
              }
            });
            arrayHoldedState = [...this.array];
            this.timeInExec -= performance.now(); // console.timeEnd("[add-event][118]");

            i++;
          }
        }

        const aux = this.array[i];
        this.array[i] = this.array[hi];
        this.array[hi] = aux;
        this.timeInExec += performance.now();
        this.addEvent(EventType.Movement, {
          initialState: arrayHoldedState,
          endState: { ...this.array
          }
        }); // console.time("[add-event][118]");

        this.timeInExec -= performance.now(); // console.timeEnd("[add-event][118]");
        // this.eventPool.push(CreateEvent(arrayHoldedState, {...this.array}, EventType.Movement));
        // arrayHoldedState = {...this.array};

        return i;
      };

      this.timeInExec -= performance.now();
      quick(0, this.array.length - 1);
      this.timeInExec += performance.now();
    } catch (error) {
      return this;
    }

    this.prepareRender(this.eventPool);
    return this;
  };
  mergeSort = () => {
    const merge = (leftArr, rightArr) => {
      var sortedArr = [];

      while (leftArr.length && rightArr.length) {
        if (leftArr[0].value <= rightArr[0].value) {
          sortedArr.push(leftArr[0]);
          leftArr = leftArr.slice(1);
        } else {
          sortedArr.push(rightArr[0]);
          rightArr = rightArr.slice(1);
        }
      }

      while (leftArr.length) sortedArr.push(leftArr.shift());

      while (rightArr.length) sortedArr.push(rightArr.shift());

      return sortedArr;
    };

    const mergeSortRecursive = arr => {
      try {
        if (arr.length < 2) {
          return arr;
        } else {
          var midpoint = Math.floor(arr.length / 2);
          var leftArr = arr.slice(0, midpoint);
          var rightArr = arr.slice(midpoint, arr.length);
          let a = merge(mergeSortRecursive(leftArr), mergeSortRecursive(rightArr));
          this.addEvent(EventType.Movement, {
            initialState: arr,
            endState: a
          });
          arr = a;
          return a;
        }
      } catch (error) {}
    };

    this.timeInExec -= performance.now();
    mergeSortRecursive(this.array);
    this.timeInExec += performance.now();
    this.prepareRender(this.eventPool);
    return this;
  };
}
export default class SorterController extends SorterLogic {
  typeInExec = "";

  constructor(div, sort, array, framesPerSecond) {
    super(div);
    this.typeInExec = sort.label;
    this.sort = this[sort.functionName];
    this.array = array;
    this.timeInExec = 0;
    this.framesPerSecond = framesPerSecond;
    this.initialRender(this.array, this.typeInExec);
  }

  cancel = () => {
    clearInterval(this.renderLoopHandler);
    this.array = null;
    this.eventPool = [];
  };
}
