import {
  Box,
  Button,
  Chip,
  CircularProgress,
  OutlinedInput,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { theme } from "../../../theme/theme";
import {
  useGetUsersQuery,
  useResetUserPasswordMutation,
  useArchiveUserMutation,
} from "../../../features/user/userApi";
import useDebounce from "../../../hooks/useDebounce";

import {
  AddOutlined,
  FileUploadOutlined,
  FileDownloadOutlined,
  Search,
} from "@mui/icons-material";
import UserAccountAction from "./UserAccountAction";
import Swal from "sweetalert2";
import UserAccountPermissions from "./UserAccountPermissions";
import UserAccountDialog from "./UserAccountDialog";
import useDisclosure from "../../../hooks/useDisclosure";

const UserAccounts = () => {
  const [status, setStatus] = useState("true");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [searchValue, setSearchValue] = useState("");
  const search = useDebounce(searchValue, 500);

  const { open, onToggle } = useDisclosure();

  const { data, isLoading, isFetching, isSuccess, isError } = useGetUsersQuery({
    Status: status,
    Search: search,
    PageNumber: pageNumber,
    PageSize: pageSize,
  });

  const [resetUser] = useResetUserPasswordMutation();
  const [archiveUser] = useArchiveUserMutation();

  const onPageNumberChange = (_, page) => {
    setPageNumber(page + 1);
  };

  const onPageSizeChange = (e) => {
    setPageSize(e.target.value);
  };

  const onArchiveAction = (data) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will move this user to the archived tab.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#9e77ed",
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        archiveUser(data)
          .unwrap()
          .then(() => {
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Archived successfully.",
              showConfirmButton: false,
              timer: 1500,
            });
          })
          .catch(() => {
            Swal.fire({
              position: "top-end",
              icon: "error",
              title: "Unable to archive this user.",
              showConfirmButton: false,
              timer: 1500,
            });
          });
      }
    });
  };

  const onResetPasswordAction = (data) => {
    console.log("data: ", data);

    Swal.fire({
      title: "Are you sure?",
      text: "This will reset the password of this user.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#9e77ed",
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        resetUser(data)
          .unwrap()
          .then(() => {
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Reset password successfully.",
              showConfirmButton: false,
              timer: 1500,
            });
          })
          .catch(() => {
            Swal.fire({
              position: "top-end",
              icon: "error",
              title: "Unable to reset password.",
              showConfirmButton: false,
              timer: 1500,
            });
          });
      }
    });
  };

  return (
    <Stack
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        backgroundColor: theme.palette.bgForm.black1,
        color: "#fff",
        padding: "64px 40px 64px",
      }}
    >
      <Stack>
        <Stack direction="row" justifyContent="space-between">
          <Stack>
            <Stack justifyItems="left">
              <Typography variant="h4">User Accounts</Typography>
            </Stack>
            <Stack justifyItems="space-between" direction="row">
              <Button
                size="small"
                variant="text"
                startIcon={<FileUploadOutlined />}
              >
                <Typography
                  sx={{
                    fontSize: "13px",
                    fontWeight: "700",
                    color: theme.palette.text.secondary,
                  }}
                >
                  Import
                </Typography>
              </Button>

              <Button
                size="small"
                variant="text"
                startIcon={<FileDownloadOutlined />}
              >
                <Typography
                  sx={{
                    fontSize: "13px",
                    fontWeight: "700",
                    color: theme.palette.text.secondary,
                  }}
                >
                  Export
                </Typography>
              </Button>
            </Stack>
          </Stack>
          <Stack alignItems="center">
            <Button
              variant="contained"
              size="large"
              color="primary"
              startIcon={<AddOutlined />}
              onClick={onToggle}
            >
              Add
            </Button>
          </Stack>
        </Stack>
      </Stack>

      <Stack
      // sx={{ backgroundColor: theme.palette.bgForm.black2, padding: "20px", borderRadius: "" }}
      >
        <Stack direction="row" justifyContent="space-between">
          <Tabs value={status} onChange={(_, value) => setStatus(value)}>
            <Tab value="" label="All" wrapped />
            <Tab value="true" label="Active" />
            <Tab value="false" label="Archived" />
          </Tabs>

          <OutlinedInput
            placeholder="Search"
            startAdornment={<Search />}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </Stack>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{ color: "#A0AEC0", fontWeight: 700 }}
                  align="center"
                >
                  LINE NO.
                </TableCell>
                <TableCell sx={{ color: "#A0AEC0", fontWeight: 700 }}>
                  FULLNAME
                </TableCell>
                <TableCell sx={{ color: "#A0AEC0", fontWeight: 700 }}>
                  USERNAME
                </TableCell>
                <TableCell sx={{ color: "#A0AEC0", fontWeight: 700 }}>
                  ROLE
                </TableCell>
                <TableCell
                  sx={{ color: "#A0AEC0", fontWeight: 700 }}
                  align="center"
                >
                  PERMISSIONS
                </TableCell>
                <TableCell
                  sx={{ color: "#A0AEC0", fontWeight: 700 }}
                  align="center"
                >
                  STATUS
                </TableCell>
                <TableCell
                  sx={{ color: "#A0AEC0", fontWeight: 700 }}
                  align="center"
                >
                  ACTIONS
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isSuccess &&
                !isLoading &&
                !isFetching &&
                data?.value?.users?.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell sx={{ color: "#A0AEC0" }} align="center">
                      {index + 1}
                    </TableCell>

                    <TableCell sx={{ color: "#A0AEC0" }}>
                      {item.fullname}
                    </TableCell>

                    <TableCell sx={{ color: "#A0AEC0" }}>
                      {item.username}
                    </TableCell>

                    <TableCell sx={{ color: "#A0AEC0" }}>
                      {item.user_Role_Name}
                    </TableCell>

                    <TableCell sx={{ color: "#A0AEC0" }} align="center">
                      <UserAccountPermissions permissions={item.permission} />
                    </TableCell>

                    <TableCell sx={{ color: "#A0AEC0" }} align="center">
                      <Chip
                        variant="outlined"
                        color={item.is_Active ? "success" : "warning"}
                        label={item.is_Active ? "ACTIVE" : "INACTIVE"}
                      />
                    </TableCell>

                    <TableCell sx={{ color: "#A0AEC0" }} align="center">
                      <UserAccountAction
                        data={item}
                        status={status}
                        onReset={onResetPasswordAction}
                        onArchive={onArchiveAction}
                      />
                    </TableCell>
                  </TableRow>
                ))}

              {isError && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="h5" color="#EDF2F7">
                      Something went wrong.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

              {(isLoading || isFetching) && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress />
                    <Typography variant="h5" color="#EDF2F7">
                      Please wait...
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

              {isSuccess && !data?.value?.users.length && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="h5" color="#EDF2F7">
                      No records found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          sx={{ color: "#A0AEC0", fontWeight: 400 }}
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data?.value?.totalCount || 0}
          rowsPerPage={data?.value?.pageSize || 5}
          page={data?.value?.currentPage - 1 || 0}
          onPageChange={onPageNumberChange}
          onRowsPerPageChange={onPageSizeChange}
        />

        <UserAccountDialog open={open} onClose={onToggle} />
      </Stack>
    </Stack>
  );
};

export default UserAccounts;
