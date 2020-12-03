export type ColumnDefinition = {
  [key: string]: any

  table_catalog: string
  table_schema: string
  table_name: string
  column_name: string
  column_default: any
  is_nullable: 'YES' | 'NO'
  data_type: string
}
