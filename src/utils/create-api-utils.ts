/**
 *
 * @param state redux statel
 * @param reducerPath RTK api reducerPath
 * @param { id: value to match, target: key to find } Ex: { [target]: id }
 */
export const selectRtkCachedItem = <T = any>(
  state: any,
  reducerPath: string,
  {
    id,
    target
  }: {
    id: number | string
    target?: string
  }
): { data: T } => {
  const currentTarget = target || 'id'
  const queries = state[reducerPath].queries
  const fulfilledDataQueries = Object.entries(queries)
    .map(el => el[1])
    .filter(el => (el as any).status === 'fulfilled')
  const listOfItems =
    fulfilledDataQueries.flatMap(el => (el as any).data?.data || (el as any).data).filter(item => Boolean(item)) || []

  console.log({ fulfilledDataQueries, listOfItems })

  const value = listOfItems.find(item => item[currentTarget] === id) || {}

  console.log({ fulfilledDataQueries, listOfItems, value, id, target })

  return { data: value }
}
