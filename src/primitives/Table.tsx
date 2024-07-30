import React from "react"
import {QueryClient} from "react-query"
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft"
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight"
import { List } from "../utils/list"
import { nop } from "../utils/functional"
import { State, useStatefull } from "../utils/state"
import { Text } from "./Text"
import { Async, asyncNoOp, bindAsync } from "../utils/asynchronism"
import { optionalMap } from "../utils/pattern-matching"
import { Col, Row } from "./Stack"
import { Box, Button, Divider } from "@mui/material"
import { asyncValue, AsyncValue, constantAsyncValue, errorAsyncValue, useAsyncValue } from "../utils/asyncValue"

type CssValue = string | number

export type Column<T> = {
  header: React.ReactNode
  width?: string | number,
  grow?: number,
  minWidth?: string | number,
  render: (value: T, i: number) => React.ReactNode
}

export type AsyncCollection<T> = {
  invalidate: Async<void>,
  fetchRange: (range: { from: number, to: number }) => AsyncValue<List<T>>,
  count: AsyncValue<number>
}

export const asyncCollection = 
  (queryClient: QueryClient) =>
    <T,>(args:  {
      key: List<unknown>,
      fetchRange: (range: { from: number, to: number }) => Async<List<T>>,
      fetchCount: Async<number>
    }): AsyncCollection<T> => ({

      invalidate: async() => queryClient.invalidateQueries(args.key as unknown[]),

      fetchRange: (range) => asyncValue(queryClient)({
        queryKey: [...args.key, range.from, range.to],
        queryFn: args.fetchRange(range),
      }),

      count: asyncValue(queryClient)({
        queryKey: [...args.key, "count"],
        queryFn: args.fetchCount
      })
    })

export const emptyAsyncCollection: AsyncCollection<never> = {
  invalidate: asyncNoOp,
  fetchRange: () => errorAsyncValue,
  count: constantAsyncValue(0)
}

export const listDataProvider = <T,>(list: List<T>): AsyncCollection<T> => ({
  invalidate: asyncNoOp,
  fetchRange: (range: { from: number, to: number }) => constantAsyncValue<List<T>>(list.slice(range.from, range.to)),
  count: constantAsyncValue(list.length)
})

export const fetchAll = <T,>(dataProvider: AsyncCollection<T>): Async<List<T>> => 
  bindAsync(dataProvider.count.read, count => dataProvider.fetchRange({ from: 0, to: count }).read)

export const Table = <T,>(
  props: {
    columnList?: List<Column<T>>
    provider?: AsyncCollection<T>
    keyExtractor?: (value: T, index: number) => string
    pageSize?: number,
    rowHeight?: CssValue,
    page?: State<number>,
    showPageControls?: boolean
    separator?: React.ReactNode
    emptyView?: React.ReactNode,
    loadingView?: React.ReactNode
  }) => {

  const columnList = props.columnList ?? []
  const provider = props.provider ?? emptyAsyncCollection

  const count = useAsyncValue(provider.count)

  const pageSize = props.pageSize ?? 20

  const pageCount = optionalMap(count.data, count => Math.ceil(count / pageSize)) 

  const separator = props.separator ?? <Divider style={{ marginTop: 4, marginBottom: 4 }}/>

  const keyExtractor = props.keyExtractor ?? ((_: T, index: number) => index.toString())

  const _page = useStatefull(() => 0)
  const page = props.page ?? _page

  const from = page.value * pageSize
  const to = Math.min(count.data ?? 0, (page.value + 1) * pageSize)
  
  const pageData = useAsyncValue(provider.fetchRange({ from, to }), {
    keepPreviousData : true,
    enabled: count.data !== undefined
  })

  return (
    <Box
      sx={pageData.data?.length === 0 ? {overflow:"hidden", width: "100%"} : {overflowX:"auto", width: "100%"}}
    >
      <Col
        sx={{width: "100%", minWidth: "max-content"}}
      >
      
        { count.data !== 0 ?
          <Header columnList={columnList} /> :
          null
        }
        {

         pageData.data !== undefined ? 
            pageData.data.length === 0 ? 
              props.emptyView :
              pageData.data.map((data, i) => 
                <React.Fragment key={keyExtractor(data, i)}>
                  <TableRow 
                    key={keyExtractor(data, i)}
                    columnList={columnList}
                    height={props.rowHeight}
                    data={data}
                    index={i}
                  />
                  {separator}
                </React.Fragment>
              ) : 
              <Text text={"Error: no se pudo cargar la tabla"}/>
         }

        { pageCount !== undefined && pageCount > 1 && (props.showPageControls ?? true) ? 
          <Pager page={page} pageCount={pageCount} /> : 
          null
        }
      </Col>
    </Box>
  )
}


const Header = (
  props: {
    columnList: List<Column<never>>
  }
) => {

  return(
    <Row 
      style={{ width: "100%", backgroundColor:"#c3e1f0" }}
    >
      {props.columnList.map((column, c) => 
        <Box 
          key={c} 
          style={cellStyle(column)}
        >
          {column.header}
        </Box>
      )}
    </Row>
  )
}

const TableRow = <T,>(
  props: {
    columnList: List<Column<T>>,
    height?: CssValue
    data: T,
    index: number
  }
) =>
    <Row 
      sx={{ width: "100%" }}
      height={props.height}
      alignItems="center"
    >
      {props.columnList.map((column, c) =>
        <Box 
          key={c} 
          sx={cellStyle(column)}
        >
          {column.render(props.data, props.index)}
        </Box> 
      )}
    </Row>

const Pager = (
  props: {
    page: State<number>,
    pageCount: number
  }
) => {

  const isFirst = props.page.value === 0
  const isLast = props.page.value === props.pageCount - 1

  return (
    <Row sx={{ widht: "100%" }} alignItems={"center"} justifyItems={"end"}>
      <Button 
        onClick={isFirst ? nop : props.page.apply(it => it - 1)}
      >
        <KeyboardArrowLeft style={{ color: isFirst ? "#AAAAAA" : "black" }}/>
      </Button>
      <Text 
        text={`${props.page.value + 1} / ${props.pageCount}`}
      />
      <Button 
        onClick={isLast ? nop : props.page.apply(it => it + 1)}
      >
        <KeyboardArrowRight style={{ color: isLast ? "#AAAAAA" : "black" }} />
      </Button>
    </Row>
  )
}

export const HeaderCell = (
  props: {
    text: string
    width?: string
    textCenter?: boolean
  }
) => {
  return <Text  
        textAlign={"center"}
        text={props.text}
        sx={{ padding: 3 }}
      />
}

export const ContentCell = (
  props: {
    text: string
    width?: string
    textCenter?: boolean
    backgroundColor?: string
    className?: string
    bold?: boolean
  }
) => {

  return(
    <Text
      sx={{ 
        fontWeight: 600,
        paddingTop: "1em",
        paddingBottom: "1em",
        height: "30%", 
        width: props.width, 
        textAlign: props.textCenter !== undefined ? "center" : "justify"
      }}
      text={props.text}
    />
  )
}

const cellStyle = <T,>(column: Column<T>): React.CSSProperties => ({
  width: column.width ?? 0, 
  flexGrow: column.grow ?? 1,
  minWidth: column.minWidth ?? 200
})
