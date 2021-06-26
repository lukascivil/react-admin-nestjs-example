export const selectRtkCachedItem = <T = any>(
  state: any,
  reducerPath: string,
  {
    id,
    target
  }: {
    id: number
    target?: string
  }
): { data: T } => {
  const currentTarget = 'id' || target
  const queries = state[reducerPath].queries
  const fulfilledDataQueries = Object.entries(queries)
    .map(el => el[1])
    .filter(el => (el as any).status === 'fulfilled')
  console.log({ fulfilledDataQueries })
  const listOfItems = fulfilledDataQueries.flatMap(el => (el as any).data?.data || (el as any).data) || []
  const value = (listOfItems as any).find(item => item[currentTarget] === id)

  console.log({ fulfilledDataQueries, listOfItems, value, id, target })

  return { data: value }
}
