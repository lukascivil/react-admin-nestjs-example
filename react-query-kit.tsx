import { QueryClient, QueryClientProvider, useMutation, useQuery, UseQueryOptions } from 'react-query'

interface QueryBuilder {
  query: ({ query }: { query: (value: any) => string; type: DefinitionType.query }) => typeof useQuery
}

interface MutateBuilder {
  mutate: ({ query }: { query: (value: any) => string; type: DefinitionType.query }) => typeof useMutation
}

// export type EndpointDefinitions<T> = { [K in keyof T]: { query: () => string } & UseQueryOptions }

// export type EndpointDefinitions2<T> = HooksWithUniqueNames<T>

// type Recursive<T> = (builder: Builder) => EndpointDefinitions<T>

export type EndpointDefinitions<T> = { [K in keyof T]: { query: () => string } & UseQueryOptions }

type Recursive<T> = (builder: QueryBuilder & MutateBuilder) => EndpointDefinitions<T>

type Recursive2<
  T extends Record<string, { query: (v: any) => string; type: DefinitionType }>,
  K extends QueryBuilder | MutateBuilder
> = (builder: K) => HooksWithUniqueNames<T, K>

export type ReplaceTagTypes<Definitions extends EndpointDefinitions, NewTagTypes extends string> = {
  [K in keyof Definitions]: Definitions[K] extends typeof useQuery
    ? typeof useQuery
    : Definitions[K] extends typeof useMutation
    ? typeof useMutation
    : never
}

// interface CreateApiOptions<C> {
//   baseQuery: any
//   endpoints: (builder: Builder) => { [K in keyof C]: { query: () => string } }
// }

// type addPrefix<TKey, TPrefix extends string> = TKey extends string ? `${TPrefix}${TKey}` : never
type addPrefixAndSufix<TKey, TPrefix extends string, TSufix extends string> = TKey extends string
  ? `${TPrefix}${TKey}${TSufix}`
  : never

// type removePrefix<TPrefixedKey, TPrefix extends string, TSufix extends string> = TPrefixedKey extends addPrefixAndSufix<
//   infer TKey,
//   TPrefix,
//   TSufix
// >
//   ? TKey
//   : ''

// type prefixedValue<
//   TObject extends object,
//   TPrefixedKey extends string,
//   TPrefix extends string,
//   TSufix extends string
// > = TObject extends {
//   [K in removePrefix<TPrefixedKey, TPrefix, TSufix>]: infer TValue
// }
//   ? TValue
//   : never

// type AddPrefixToObject<TObject extends object, TPrefix extends string, TSufix extends string> = {
//   [K in addPrefixAndSufix<keyof TObject, TPrefix, TSufix>]: prefixedValue<TObject, K, TPrefix, TSufix>
// }

const asElementTypes = <T,>(et: { [K in keyof T]: any }) => et

// export type Api<BaseQuery extends BaseQueryFn, Definitions extends EndpointDefinitions> = UnionToIntersection<
//   ApiModules<BaseQuery, Definitions, ReducerPath, TagTypes>[Enhancers]
// >

// export type CreateApi = {
//   <BaseQuery = any, Definitions extends EndpointDefinitions>(options: CreateApiOptions<any, Definitions>): Api<
//     BaseQuery,
//     Definitions
//   >
// }

const createApi = <C extends Recursive<object>>({
  baseQuery,
  endpoints
}: {
  reducerPath: string
  baseQuery: any
  endpoints: C
  // }): AddPrefixToObject<ReturnType<C>, 'use', 'Query'> => {
}) => {
  const keys = Object.keys(endpoints)
  const builder = {
    query: useQuery,
    mutate: useMutation
  }
  // const newEndPoints = endpoints(builder)

  // return asElementTypes(newEndPoints)

  const cafe = asElementTypes<ReturnType<C>>(endpoints(builder))

  // return cafe as HooksWithUniqueNames<ReturnType<Recursive2<C>>>
  // return endpoints(builder) as HooksWithUniqueNames<ReturnType<C>>

  // const newCafe = {} as typeof asElementTypes<ReturnType<C>>

  // for (const key in cafe) {
  //   const element = cafe[key]

  //   newCafe[`use${key}Query`] = element
  // }

  // return newCafe

  const result = Object.keys(cafe).map(([endpointName, partialDefinition]) => ({
    [`use${endpointName}Query` as keyof ReturnType<C>]: partialDefinition
  }))

  return result

  // return { [keys[0]]: builder => useQuery('repoData', () => Promise.resolve()) }
}

export enum DefinitionType {
  query = 'query',
  mutation = 'mutation'
}

// export type EndpointDefinition = typeof useQuery | typeof useMutation

// export type EndpointDefinitions2 = Record<string, EndpointDefinition>

export type HooksWithUniqueNames<
  Definitions extends Record<string, { query: (v: any) => string; type: DefinitionType }>,
  KA
> = keyof Definitions extends infer Keys
  ? Keys extends string
    ? KA extends QueryBuilder
      ? {
          [K in Keys as `use${Capitalize<K>}Query`]: typeof useQuery
        }
      : KA extends MutateBuilder
      ? {
          [K in Keys as `use${Capitalize<K>}Mutation`]: typeof useMutation
        }
      : never
    : never
  : never

type Named<Definitions extends Record<string, any>> = keyof Definitions extends infer Keys
  ? Keys extends string
    ? Definitions[Keys] extends { type: DefinitionType.query }
      ? {
          [K in Keys as `use${Capitalize<K>}Query`]: typeof useQuery
        }
      : Definitions[Keys] extends { type: DefinitionType.mutation }
      ? {
          [K in Keys as `use${Capitalize<K>}Mutation`]: typeof useMutation
        }
      : never
    : never
  : never

// type EndpointDefinitions = Record<Named, EndpointDefinition>

// type EndpointDefinition<T> = { [K in keyof T]: { query: () => string } & UseQueryOptions }

export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: Promise,
  endpoints: builder => ({
    cafe: builder.query<boolean, string>({
      query: name => `pokemon/${name}`,
      type: 'query'
    }),
    cafe3: builder.query<boolean, string>({
      query: name => `pokemon/${name}`,
      type: 'query'
    }),
    cafe2: builder.mutate<boolean, string>({
      query: name => `pokemon/${name}`,
      type: 'mutation'
    })
  })
})

const { cafe, cafe2, endpoints, useCafeQuery, useCafe2Mutator } = pokemonApi

console.log({ cafe, cafe2, endpoints })

useCafeQuery({ queryKey: ['cafe'] })
