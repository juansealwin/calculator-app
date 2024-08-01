import { Button, Paper, Stack, styled, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow } from "@mui/material"
import { useStatefull } from "../utils/state"
import { useLoggedUser } from "../hooks/context"
import { useAsynchronous } from "../utils/asynchronism"
import { useEffect } from "react"
import { Text } from "../primitives/Text"
import { Row } from "../primitives/Stack"
import { ArrowBack, ArrowForward } from "@mui/icons-material"
import { nop } from "../utils/functional"
import Table from '@mui/material/Table'
import { List } from "../utils/list"

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor:  "#259d85", 
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}))

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString()
}

export const HistoryRecordPage = () => {
    
    const user = useLoggedUser()

    const fetchRecordsAsync = useAsynchronous(user.actions.getRecords) 
    const deleteRecordsAsync = useAsynchronous(user.actions.deleteRecord) 
    const page = useStatefull(() => 0)
    //const deletedRecords = useStatefull<List<number>>(() => [])

    useEffect(
      fetchRecordsAsync.run({ limit: 10, skip: page.value * 10 }), 
      [user.credentials.accessToken, user.credentials.userData.username, page.value]
    )

    return (
      <Stack width={"100%"} alignItems="center" height="100vh" position={"relative"}>
                
        <Text text={"Operation history"} fontSize={40} margin={4} sx={{textDecoration: "underline"}} color={"#333333"}/>
        {
          fetchRecordsAsync.result !== undefined ?
          <TableContainer component={Paper} sx={{ maxWidth: "75%" }}>
            <Table sx={{ minWidth: 700 }}>
              <TableHead sx={{ color: "#259d85" }}>
                <TableRow>
                  <StyledTableCell>Id</StyledTableCell>
                  <StyledTableCell align="right">Date</StyledTableCell>
                  <StyledTableCell align="right">Numeric result</StyledTableCell>
                  <StyledTableCell align="right">Balance</StyledTableCell>
                  <StyledTableCell align="right">Final Result</StyledTableCell>
                  <StyledTableCell align="center">Delete </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fetchRecordsAsync.result.map((row) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell component="th" scope="row">{row.id}</StyledTableCell>
                    <StyledTableCell align="right">{formatDate(row.date)}</StyledTableCell>
                    <StyledTableCell align="right">{row.amount}</StyledTableCell>
                    <StyledTableCell align="right">{row.user_balance}</StyledTableCell>
                    <StyledTableCell align="right">{row.operation_response}</StyledTableCell>
                    <StyledTableCell align="center">
                      <Button 
                        children={<Text text={"Delete record"} fontSize={10} color={"white"}/>} 
                        sx={{ background: "#f44236", "&:hover": { backgroundColor: "#e43226" } }} 
                        variant="contained"
                        onClick={deleteRecordsAsync.run({recordId: row.id})}
                        //disabled={deletedRecords.value.includes(row.id)}
                      /> 
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
            <Row justifyContent={"right"} spacing={3} padding={3}>
                  <ArrowBack 
                    onClick={page.value > 0 ? page.apply(it => it - 1) : nop} 
                    sx={{ cursor: "pointer" }}
                  />
                  <ArrowForward 
                    onClick={fetchRecordsAsync.result?.length === 10 ? page.apply(it => it + 1) : nop} 
                    sx={{ cursor: "pointer" }}
                  />
                </Row>
          </TableContainer> :
          <Text text={"No operations have been performed yet"} />

        }
      </Stack>
    )
}
