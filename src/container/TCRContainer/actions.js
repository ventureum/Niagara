export function listIsLoading (bool: boolean) {
  return {
    type: 'LIST_IS_LOADING',
    isLoading: bool
  }
}
export function fetchListSuccess (list: Object) {
  return {
    type: 'FETCH_LIST_SUCCESS',
    list
  }
}
export function fetchList (url: any) {
  return dispatch => {
    dispatch(fetchListSuccess((url: any)))
    dispatch(listIsLoading(false))
  }
}
export function delisted (hash: any) {
  return dispatch => {
    dispatch({
      type: 'PROJECT_DELISTED',
      hash
    })
  }
}
export function whitelisted (hash: any) {
  return dispatch => {
    dispatch({
      type: 'PROJECT_WHITELISTED',
      hash
    })
  }
}
export function voted (hash: any) {
  return dispatch => {
    dispatch({
      type: 'PROJECT_VOTED',
      hash
    })
  }
}
