export type Person = {
  name: string
  mass: string
  height: string
  hair_color: string
  skin_color: string
}

export type PeoplePage = {
  count: number
  next: string | null
  previous: string | null
  results: Person[]
}
