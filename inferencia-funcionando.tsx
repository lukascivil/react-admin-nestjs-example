import { QueryClient, QueryClientProvider, useMutation, useQuery, UseQueryOptions } from 'react-query'

interface Builder {
  query: <P, R>({ query }: { query: (value: P) => string }) => typeof useQuery
  mutate: typeof useMutation
}

export type EndpointDefinitions<T> = { [K in keyof T]: { query: () => string } & UseQueryOptions }

type Recursive<T> = (builder: Builder) => EndpointDefinitions<T>

export type ReplaceTagTypes<Definitions extends EndpointDefinitions, NewTagTypes extends string> = {
  [K in keyof Definitions]: Definitions[K] extends typeof useQuery
    ? typeof useQuery
    : Definitions[K] extends typeof useMutation
    ? typeof useMutation
    : never
}

interface CreateApiOptions<C> {
  baseQuery: any
  endpoints: (builder: Builder) => { [K in keyof C]: { query: () => string } }
}

// type addPrefix<TKey, TPrefix extends string> = TKey extends string ? `${TPrefix}${TKey}` : never
type addPrefixAndSufix<TKey, TPrefix extends string, TSufix extends string> = TKey extends string
  ? `${TPrefix}${TKey}${TSufix}`
  : never

type removePrefix<TPrefixedKey, TPrefix extends string, TSufix extends string> = TPrefixedKey extends addPrefixAndSufix<
  infer TKey,
  TPrefix,
  TSufix
>
  ? TKey
  : ''

type prefixedValue<
  TObject extends object,
  TPrefixedKey extends string,
  TPrefix extends string,
  TSufix extends string
> = TObject extends {
  [K in removePrefix<TPrefixedKey, TPrefix, TSufix>]: infer TValue
}
  ? TValue
  : never

type AddPrefixToObject<TObject extends object, TPrefix extends string, TSufix extends string> = {
  [K in addPrefixAndSufix<keyof TObject, TPrefix, TSufix>]: prefixedValue<TObject, K, TPrefix, TSufix>
}

// const asElementTypes = <T,>(et: { [K in keyof T]: any }) => et

// export type EndpointDefinition<QueryArg> = typeof useQuery | typeof useMutation

// export type Api<BaseQuery extends BaseQueryFn, Definitions extends EndpointDefinitions> = UnionToIntersection<
//   ApiModules<BaseQuery, Definitions, ReducerPath, TagTypes>[Enhancers]
// >

// export type CreateApi = {
//   <BaseQuery = any, Definitions extends EndpointDefinitions>(options: CreateApiOptions<any, Definitions>): Api<
//     BaseQuery,
//     Definitions
//   >
// }

// CreateApiOptions<C>
// const createApi = <C,>({ baseQuery, endpoints }: CreateApiOptions<C>): ReturnType<CreateApiOptions<C>['endpoints']> => {
const createApi = <C extends Recursive<object>>({
  baseQuery,
  endpoints
}: {
  reducerPath: string
  baseQuery: any
  endpoints: C
}): AddPrefixToObject<ReturnType<C>, 'use', 'Query'> => {
  const keys = Object.keys(endpoints)
  const builder = {
    query: useQuery,
    mutate: useMutation
  }

  // const newEndPoints = endpoints(builder)

  // return asElementTypes(newEndPoints)

  return endpoints(builder) as AddPrefixToObject<ReturnType<C>, 'use'>

  // const result = Object.entries(newEndPoints).map(([endpointName, partialDefinition]) => ({
  //   [`use${endpointName}Query` as addPrefix<typeof endpointName, `use`>]: partialDefinition
  // }))

  // return result

  // return { [keys[0]]: builder => useQuery('repoData', () => Promise.resolve()) }
}

export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: Promise,
  endpoints: builder => ({
    cafe: builder.query<boolean, string>({
      query: name => `pokemon/${name}`
    }),
    cafe2: builder.query<boolean, string>({
      query: name => `pokemon/${name}`
    })
  })
})

const { cafe, cafe2, endpoints, usecafeQuery } = pokemonApi

console.log({ cafe, cafe2, endpoints })

usecafeQuery({ queryKey: ['cafe'] })
