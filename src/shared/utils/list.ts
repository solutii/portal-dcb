export const filterList = (filteringList: any[], query: string, field?: string): any[] => query ?
    filteringList.filter(item => 
      field ?
          item[field].toLowerCase().includes(query.toLowerCase())
        :
          Object.entries(item)
            .map((entrie: [string, any]) => entrie[1].toString().toLowerCase().includes(query.toLowerCase()))
            .some(isQueryIncludedOnValueEntry => isQueryIncludedOnValueEntry)
    )
  : 
    filteringList