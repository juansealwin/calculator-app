import React from "react"
import {
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  styled,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material"
import { setTo, useStatefull } from "../utils/state"
import { useLoggedUser } from "../hooks/context"
import { useAsynchronous } from "../utils/asynchronism"
import { useEffect } from "react"
import { Text } from "../components/primitives/Text"
import { Row } from "../components/primitives/Stack"
import { ArrowBack, ArrowForward } from "@mui/icons-material"
import { nop } from "../utils/functional"
import Table from "@mui/material/Table"
import SearchIcon from "@mui/icons-material/Search"
import { StringEditor } from "../components/primitives/StringEditor"

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#259d85",
    color: theme.palette.common.white
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0
  }
}))

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString()
}

export type RecordColumns = "id" | "date" | "amount" | "user_balance" | "operation_response"

export type SortOrder = "asc" | "dsc"

export const HistoryRecordPage = () => {
  const user = useLoggedUser()

  const fetchRecordsAsync = useAsynchronous(user.actions.getRecords)
  const deleteRecordsAsync = useAsynchronous(user.actions.deleteRecord)
  const page = useStatefull(() => 0)

  const search = useStatefull(() => "")
  const sortBy = useStatefull<RecordColumns>(() => "date")
  const sortOrder = useStatefull<SortOrder>(() => "asc")

  const runFetchRecords = fetchRecordsAsync.run({
    limit: 10,
    skip: page.value * 10,
    search: search.value,
    sortBy: sortBy.value,
    sortOrder: sortOrder.value
  })

  useEffect(runFetchRecords, [user.credentials.accessToken, page.value, deleteRecordsAsync.result])

  return (
    <Stack width={"100%"} alignItems="center" height="100%" position={"relative"}>
      <Text
        text={"Operation history"}
        fontSize={40}
        margin={4}
        sx={{ textDecoration: "underline" }}
        color={"#333333"}
      />

      <Row spacing={5} padding={2}>
        <StringEditor label="Search" state={search} style={{ width: 250 }} />

        <FormControl variant="outlined" sx={{ width: 250 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy.value}
            onChange={(e) => {
              const newValue = e.target.value as RecordColumns
              setTo(sortBy, newValue)()
            }}
            label="Sort By"
          >
            <MenuItem value="id">Id</MenuItem>
            <MenuItem value="date">Date</MenuItem>
            <MenuItem value="amount">Numeric Result</MenuItem>
            <MenuItem value="user_balance">Balance</MenuItem>
            <MenuItem value="operation_response">Final Result</MenuItem>
          </Select>
        </FormControl>

        <FormControl variant="outlined" sx={{ width: 250 }}>
          <InputLabel>Sort Order</InputLabel>
          <Select
            value={sortOrder.value}
            onChange={(e) => {
              const newValue = e.target.value as SortOrder
              setTo(sortOrder, newValue)()
            }}
            label="Sort Order"
          >
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          children={
            <Row spacing={1.5}>
              <Text text={"Buscar"} />
              <SearchIcon />
            </Row>
          }
          onClick={runFetchRecords}
        />
      </Row>
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
            {fetchRecordsAsync.status === "running" ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : fetchRecordsAsync.result !== undefined ? (
              fetchRecordsAsync.result.map((row) => (
                <StyledTableRow key={row.id}>
                  <StyledTableCell component="th" scope="row">
                    {row.id}
                  </StyledTableCell>
                  <StyledTableCell align="right">{formatDate(row.date)}</StyledTableCell>
                  <StyledTableCell align="right">{row.amount}</StyledTableCell>
                  <StyledTableCell align="right">{row.user_balance}</StyledTableCell>
                  <StyledTableCell align="right">{row.operation_response}</StyledTableCell>
                  <StyledTableCell align="center">
                    <Button
                      children={<Text text={"Delete record"} fontSize={10} color={"white"} />}
                      sx={{
                        background: "#f44236",
                        "&:hover": { backgroundColor: "#e43226" }
                      }}
                      variant="contained"
                      onClick={deleteRecordsAsync.run({ recordId: row.id })}
                      disabled={deleteRecordsAsync.status === "running"}
                    />
                  </StyledTableCell>
                </StyledTableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Text text={"No operations have been performed yet"} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <Row justifyContent={"right"} spacing={3} padding={3}>
          <ArrowBack
            onClick={page.value > 0 ? page.apply((it) => it - 1) : nop}
            sx={{ cursor: "pointer" }}
          />
          <ArrowForward
            onClick={fetchRecordsAsync.result?.length === 10 ? page.apply((it) => it + 1) : nop}
            sx={{ cursor: "pointer" }}
          />
        </Row>
      </TableContainer>
    </Stack>
  )
}
