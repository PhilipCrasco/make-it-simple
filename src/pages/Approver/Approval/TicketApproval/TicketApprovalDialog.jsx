import React, { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { theme } from "../../../../theme/theme";

import { Box, Button, Dialog, DialogActions, DialogContent, Divider, IconButton, Stack, Tab, Tabs, Tooltip, Typography, useMediaQuery } from "@mui/material";
import { AccountCircleRounded, AttachFileOutlined, Close, FiberManualRecord, FileDownloadOutlined, GetAppOutlined } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

import { useLazyGetRequestorAttachmentQuery } from "../../../../features/api_request/concerns/concernApi";
import { useApproveTicketMutation } from "../../../../features/api_ticketing/approver/ticketApprovalApi";
import Swal from "sweetalert2";

const TicketApprovalDialog = ({ data, open, onClose }) => {
  const [attachments, setAttachments] = useState([]);

  const [approveTicket, { isLoading: approveTicketIsLoadinng, isFetching: approveTicketIsFetching }] = useApproveTicketMutation();

  const onApproveAction = () => {
    const approvePayload = {
      approveClosingRequests: [
        {
          closingTicketId: data?.closingTicketId,
        },
      ],
    };

    console.log("Payload: ", approvePayload);
    Swal.fire({
      title: "Confirmation",
      text: "Approve this request?",
      icon: "info",
      color: "white",
      showCancelButton: true,
      background: "#111927",
      confirmButtonColor: "#9e77ed",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      cancelButtonColor: "#1C2536",
      heightAuto: false,
      width: "30em",
      customClass: {
        container: "custom-container",
        title: "custom-title",
        htmlContainer: "custom-text",
        icon: "custom-icon",
        confirmButton: "custom-confirm-btn",
        cancelButton: "custom-cancel-btn",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        approveTicket(approvePayload)
          .unwrap()
          .then(() => {
            toast.success("Success!", {
              description: "Approve request successfully!",
              duration: 1500,
            });
            onClose();
          })
          .catch((err) => {
            console.log("Error", err);
            toast.error("Error!", {
              description: err.data.error.message,
              duration: 1500,
            });
          });
      }
    });
  };

  useEffect(() => {
    if (data) {
      setAttachments(
        data?.closingAttachments?.map((item) => ({
          ticketAttachmentId: item.ticketAttachmentId,
          name: item.fileName,
          size: (item.fileSize / (1024 * 1024)).toFixed(2),
          link: item.attachment,
        }))
      );
    }
  }, [data]);

  const onCloseHandler = () => {
    onClose();
  };

  console.log("Data: ", data);

  return (
    <>
      <Dialog fullWidth maxWidth="xl" open={open}>
        <Toaster richColors position="top-right" closeButton />

        <DialogContent>
          {/* REQUESTOR */}
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" gap={1} alignItems="center">
              <AccountCircleRounded sx={{ fontSize: "70px" }} />
              <Stack>
                <Typography sx={{ fontSize: "14px", color: theme.palette.primary.main, fontStyle: "italic", letterSpacing: 1, fontWeight: 400 }}>for closing: </Typography>
                <Typography
                  sx={{
                    fontSize: "15px",
                    color: "#6dc993",
                    fontWeight: 700,
                  }}
                >
                  {data?.fullname}
                </Typography>
                <Typography sx={{ fontSize: "14px", color: theme.palette.text.secondary }}>{data?.department_Name}</Typography>
                <Typography sx={{ fontSize: "14px", color: theme.palette.text.secondary }}>{data?.channel_Name}</Typography>
              </Stack>
            </Stack>

            <Stack direction="row" gap={0.5} alignItems="center">
              <IconButton onClick={onCloseHandler}>
                <Close />
              </IconButton>
            </Stack>
          </Stack>

          <Divider variant="fullWidth" sx={{ background: "#2D3748", marginTop: 1 }} />

          <Stack gap={2} sx={{ marginTop: 2, justifyContent: "space-between" }}>
            <Stack sx={{ background: theme.palette.bgForm.black2, padding: 2, borderRadius: "20px" }}>
              {/* CONCERN DETAILS */}
              <Stack
                marginTop={3}
                padding={2}
                gap={1}
                sx={{
                  border: "1px solid #2D3748",
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  paddingLeft={8}
                  paddingRight={8}
                  gap={2}
                  sx={{
                    width: "100%",
                  }}
                >
                  <Stack
                    sx={{
                      width: "30%",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "14px",
                        color: theme.palette.text.secondary,
                      }}
                    >
                      Concern Details:
                    </Typography>
                  </Stack>

                  <Stack
                    direction="row"
                    gap={1}
                    sx={{
                      width: "65%",
                    }}
                  >
                    <FiberManualRecord color="primary" fontSize="20px" />
                    <Typography sx={{ fontSize: "14px" }}>{data?.concern_Details}</Typography>
                  </Stack>
                </Stack>

                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  paddingLeft={8}
                  paddingRight={8}
                  gap={2}
                  sx={{
                    width: "100%",
                  }}
                >
                  <Stack
                    sx={{
                      width: "30%",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "14px",
                        color: theme.palette.text.secondary,
                      }}
                    >
                      Resolution:
                    </Typography>
                  </Stack>

                  <Stack
                    direction="row"
                    gap={1}
                    sx={{
                      width: "65%",
                    }}
                  >
                    <FiberManualRecord color="primary" fontSize="20px" />
                    <Typography sx={{ fontSize: "14px" }}>{data?.resolution}</Typography>
                  </Stack>
                </Stack>

                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  paddingLeft={8}
                  paddingRight={8}
                  gap={2}
                  sx={{
                    width: "100%",
                  }}
                >
                  <Stack
                    sx={{
                      width: "30%",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "14px",
                        color: theme.palette.text.secondary,
                      }}
                    >
                      Category:
                    </Typography>
                  </Stack>

                  <Stack
                    direction="row"
                    gap={1}
                    sx={{
                      width: "65%",
                    }}
                  >
                    <FiberManualRecord color="primary" fontSize="20px" />
                    <Typography sx={{ fontSize: "14px" }}>{data?.category_Description}</Typography>
                  </Stack>
                </Stack>

                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  paddingLeft={8}
                  paddingRight={8}
                  gap={2}
                  sx={{
                    width: "100%",
                  }}
                >
                  <Stack
                    sx={{
                      width: "30%",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "14px",
                        color: theme.palette.text.secondary,
                      }}
                    >
                      Sub Category:
                    </Typography>
                  </Stack>

                  <Stack
                    direction="row"
                    gap={1}
                    sx={{
                      width: "65%",
                    }}
                  >
                    <FiberManualRecord color="primary" fontSize="20px" />
                    <Typography sx={{ fontSize: "14px" }}>{data?.subCategoryDescription}</Typography>
                  </Stack>
                </Stack>
              </Stack>

              {/* ATTACHMENTS */}
              <Stack
                marginTop={3}
                padding={4}
                sx={{
                  border: "1px solid #2D3748",
                }}
              >
                <Stack direction="row" gap={1} alignItems="center">
                  <GetAppOutlined sx={{ color: theme.palette.text.secondary }} />

                  <Typography
                    sx={{
                      fontSize: "14px",
                      color: theme.palette.text.secondary,
                    }}
                  >
                    Attachment(s):
                  </Typography>
                </Stack>

                {!attachments?.length ? (
                  <Stack sx={{ flexDirection: "column", maxHeight: "auto" }}>
                    <Stack direction="row" gap={0.5} justifyContent="center">
                      <AttachFileOutlined sx={{ color: theme.palette.text.secondary }} />
                      <Typography sx={{ color: theme.palette.text.secondary }}>No attached file</Typography>
                    </Stack>
                  </Stack>
                ) : (
                  <Stack sx={{ flexDirection: "column", maxHeight: "auto" }}>
                    {attachments?.map((fileName, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          width: "100%",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          padding: 1,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: 0.5,
                            borderBottom: "1px solid #2D3748",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <Typography sx={{ fontSize: "14px" }}>{fileName.name}</Typography>

                            <Typography
                              sx={{
                                fontSize: "14px",
                                color: theme.palette.text.secondary,
                              }}
                            >
                              {fileName.size} Mb
                            </Typography>
                          </Box>

                          <Box>
                            <Tooltip title="Download">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => {
                                  window.location = fileName.link;
                                }}
                                style={{
                                  background: "none",
                                }}
                              >
                                <FileDownloadOutlined />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                )}

                <Stack sx={{ flexDirection: "column", maxHeight: "auto" }}>
                  {attachments?.map((fileName, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        width: "100%",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        padding: 1,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: 0.5,
                          borderBottom: "1px solid #2D3748",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <Typography sx={{ fontSize: "14px" }}>{fileName.name}</Typography>

                          <Typography
                            sx={{
                              fontSize: "14px",
                              color: theme.palette.text.secondary,
                            }}
                          >
                            {fileName.size} Mb
                          </Typography>
                        </Box>

                        <Box>
                          <Tooltip title="Download">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => {
                                window.location = fileName.link;
                              }}
                              style={{
                                background: "none",
                              }}
                            >
                              <FileDownloadOutlined />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Stack sx={{ flexDirection: "row", gap: 0.5, padding: 2 }}>
            <LoadingButton variant="contained" color="success" onClick={onApproveAction}>
              Approve
            </LoadingButton>

            <LoadingButton type="submit" variant="contained" color="error">
              Disapprove
            </LoadingButton>
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TicketApprovalDialog;
