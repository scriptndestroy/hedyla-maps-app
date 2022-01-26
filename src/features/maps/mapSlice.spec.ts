import mapReducer, {
  callDirectionsAPI,MapState,setEnd,setStart
} from './mapSlice';

describe('counter reducer', () => {
  const initialState: MapState = {
    fee:'',
    price: '',
    end: '',
    start: '',
    status: 'idle',
    distance: 0,
    errorMsg: {}
  };
  // it('should handle initial state', () => {
  //   expect(counterReducer(undefined, { type: 'unknown' })).toEqual({
  //     value: 0,
  //     status: 'idle',
  //   });
  // });

  // it('should handle increment', () => {
  //   const actual = counterReducer(initialState, increment());
  //   expect(actual.value).toEqual(4);
  // });

  it('should handle start', () => {
    const actual = mapReducer(initialState, setStart('Madrid, es'));
    expect(actual.start).toEqual('Madrid');
  });

  it('should handle end', () => {
    const actual = mapReducer(initialState, setEnd('Barcelona, es'));
    expect(actual.end).toEqual('Barcelona, es');
  });
});
