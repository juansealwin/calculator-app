import { CircularProgress, Paper, Stack } from "@mui/material"
import { useStatefull } from "../utils/state"
import { useLoggedUser } from "../hooks/context"
import { useAsynchronous } from "../utils/asynchronism"
import { useEffect } from "react"
import { Text } from "../primitives/Text"
import { Row } from "../primitives/Stack"
import { Column, ContentCell, HeaderCell, listDataProvider, Table } from "../primitives/Table"
import { Record } from "../utils/serialization"
import { List } from "../utils/list"


export const HistoryRecordPage = () => {
    
    const user = useLoggedUser()

    const fetchRecordsAsync = useAsynchronous(user.actions.getRecords) 

    console.log(fetchRecordsAsync)

    const records = fetchRecordsAsync.result

    useEffect(fetchRecordsAsync.run({}), [user.credentials.accessToken, user.credentials.userData.username])

    return (
        <Stack width={"100%"} alignItems="center" height="100vh" position={"relative"}>
                
            <Text text={"Operation history"} fontSize={40} margin={4} sx={{textDecoration: "underline"}} color={"#333333"}/>

            {
                fetchRecordsAsync.result !== undefined && fetchRecordsAsync.status === "completed"?
                <Paper sx={{ height:"auto"}} elevation={fetchRecordsAsync.result.length === 0 ? 0 : 5}>
                    <Table<Record>
                    provider={listDataProvider(fetchRecordsAsync.result)}
                    pageSize={10}
                    keyExtractor={value => `${value.id}`}
                    loadingView={
                        <CircularProgress 
                            sx={{ 
                            position: "absolute", 
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            fontSize: "500px",
                            width: "360px",
                            height: "360px"
                            }}
                            size={100}
                        />
                    }
                    emptyView={<Text text={"No operations have been performed yet"} />}
                    columnList={columns()}
                    />
                </Paper> : 
                <CircularProgress 
                    sx={{ 
                        position: "absolute", 
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        fontSize: "500px",
                        width: "360px",
                        height: "360px"
                    }}
                    size={100}
                />
            }
       
        </Stack>
    )
}

const columns = (): List<Column<Record>> => [
    {
      header: <HeaderCell text={"Id"} textCenter />,
      render: it =>
        <ContentCell
          text={`${it.id}`}
          textCenter
        />,
      grow: 1,
      width: 0,
    },
    {
      header: <HeaderCell text={"Date"} textCenter />,
      render: it => <ContentCell
            text={it.date}
            textCenter
          />,
      grow: 1,
      width: 0,
    },
    {
      header: <HeaderCell text={"Amount"} textCenter />,
      render: it =>
        <ContentCell
          text={`${it.amount}`}
          textCenter
        />,
      grow: 1,
      width: 0,
    },
    {
      header: <HeaderCell text={"Balance"} textCenter />,
      render: it =>
        <ContentCell
          text={`${it.user_balance}`}
          textCenter
        />,
      grow: 1,
      width: 0,
    },
    {
      header: <HeaderCell text={"Result"} />,
      render: it =>
      <ContentCell
        text={it.operation_response}
        textCenter
        />,
      grow: 1,
      width: 0,
    }
  ]