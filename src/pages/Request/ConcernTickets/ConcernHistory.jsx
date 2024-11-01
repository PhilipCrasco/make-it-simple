import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import { theme } from "../../../theme/theme";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineOppositeContent, TimelineSeparator, timelineOppositeContentClasses } from "@mui/lab";
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, Divider, IconButton, Stack, Tooltip, Typography, useMediaQuery } from "@mui/material";
import { useGetTicketHistoryQuery } from "../../../features/api_ticketing/issue_handler/concernIssueHandlerApi";
import {
  AccessTimeOutlined,
  AttachFileOutlined,
  Close,
  FiberManualRecord,
  FileDownloadOutlined,
  GetAppOutlined,
  PersonOutlineOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import { useLazyGetRequestorAttachmentQuery } from "../../../features/api_request/concerns/concernApi";
import { useLazyGetDownloadAttachmentQuery, useLazyGetViewAttachmentQuery } from "../../../features/api_attachments/attachmentsApi";

const requestorSchema = yup.object().shape({
  RequestAttachmentsFiles: yup.array().nullable(),
});

const ConcernHistory = ({ data, status, open, onClose }) => {
  const [attachments, setAttachments] = useState([]);
  const [ticketAttachmentId, setTicketAttachmentId] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null); // To handle the selected image
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false); // To control the view dialog

  const [downloadLoading, setDownloadLoading] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);

  const fileInputRef = useRef();

  const { data: historyData } = useGetTicketHistoryQuery(data?.ticketRequestConcerns?.[0]?.ticketConcernId, {
    skip: !data?.ticketRequestConcerns?.[0]?.ticketConcernId,
  });

  const [getRequestorAttachment] = useLazyGetRequestorAttachmentQuery();
  const [getViewAttachment] = useLazyGetViewAttachmentQuery();
  const [getDownloadAttachment] = useLazyGetDownloadAttachmentQuery();

  // const isSmallScreen = useMediaQuery("(max-width: 1024px) and (max-height: 911px)");

  const { control } = useForm({
    resolver: yupResolver(requestorSchema),
    defaultValues: {
      RequestAttachmentsFiles: [],
    },
  });

  const handleAttachments = (event) => {
    // console.log("event: ", event);
    const newFiles = Array.from(event.target.files);

    const fileNames = newFiles.map((file) => ({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2),
    }));

    const uniqueNewFiles = fileNames.filter((newFile) => !attachments?.some((existingFile) => existingFile.name === newFile.name));

    setAttachments((prevFiles) => (Array.isArray(prevFiles) ? [...prevFiles, ...uniqueNewFiles] : [...uniqueNewFiles]));
  };

  const onCloseHandler = () => {
    onClose();
  };

  const getAttachmentData = async (id) => {
    try {
      const res = await getRequestorAttachment({ Id: id }).unwrap();

      //   console.log("res", res);

      setAttachments(
        res?.value?.[0]?.attachments?.map((item) => ({
          ticketAttachmentId: item.ticketAttachmentId,
          name: item.fileName,
          size: (item.fileSize / (1024 * 1024)).toFixed(2),
          link: item.attachment,
          file: item,
        }))
      );
    } catch (error) {}
  };

  useEffect(() => {
    if (data) {
      getAttachmentData(data?.ticketRequestConcerns?.[0]?.ticketConcernId);
    }
  }, [data]);

  // Function to open image view dialog
  const handleViewImage = async (file) => {
    setViewLoading(true);
    try {
      const response = await getViewAttachment(file?.ticketAttachmentId);

      console.log("Res: ", response);

      if (response?.data) {
        const imageUrl = URL.createObjectURL(response.data); // Create a URL for the fetched image
        setSelectedImage(imageUrl); // Set the image URL to state
        setIsViewDialogOpen(true);
        setViewLoading(false);
      }
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  const handleDownloadAttachment = async (file) => {
    setDownloadLoading(true);
    try {
      const response = await getDownloadAttachment(file?.ticketAttachmentId);

      if (response?.data) {
        const blob = new Blob([response.data], { type: response.data.type });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${file?.name || "attachment"}`); // Default to 'attachment' if no name
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // Clean up after download
        setDownloadLoading(false);
      } else {
        console.log("No data in the response");
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  const isImageFile = (fileName) => {
    return /\.(jpg|jpeg|png)$/i.test(fileName);
  };

  const handleViewClose = () => {
    setIsViewDialogOpen(false);
    setSelectedImage(null);
  };

  return (
    <>
      <Dialog fullWidth maxWidth="md" open={open}>
        <DialogContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" gap={1} alignItems="center">
              <Stack>
                <Typography variant="h5" sx={{ color: theme.palette.text.main, fontWeight: "700", fontSize: "18px" }}>
                  {`Concern Number: ${data?.requestConcernId}`}
                </Typography>
              </Stack>
            </Stack>

            <Stack direction="row" gap={0.5} alignItems="center">
              <IconButton onClick={onCloseHandler}>
                <Close />
              </IconButton>
            </Stack>
          </Stack>

          <Divider variant="fullWidth" sx={{ background: "#2D3748", marginTop: 1 }} />

          <Stack sx={{ marginTop: 2, justifyContent: "space-between" }}>
            <Stack gap={2} sx={{ padding: 2, borderRadius: "20px" }}>
              {/* <Stack sx={{ width: "100%", background: theme.palette.bgForm.black2, padding: 2, borderRadius: "20px" }}>
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
                        Request Number:
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
                      <Typography sx={{ fontSize: "14px" }}>{data?.requestConcernId}</Typography>
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
                        Ticket Number:
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

                      {data?.concern_Status === "For Approval" ? (
                        <Typography sx={{ fontSize: "14px", color: theme.palette.warning.main, fontStyle: "italic" }}>Ticket not yet assigned</Typography>
                      ) : (
                        <Typography sx={{ fontSize: "14px" }}>{data?.ticketRequestConcerns?.[0]?.ticketConcernId}</Typography>
                      )}
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
                      <Typography
                        sx={{ fontSize: "14px" }}
                        dangerouslySetInnerHTML={{
                          __html: data?.concern.replace(/\r\n/g, "<br />"),
                        }}
                      >
                        {data?.concern_Details}
                      </Typography>
                    </Stack>
                  </Stack>

                  {(status === "For Confirmation" || status === "Done") && (
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
                  )}

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
                        Assign To:
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

                      {data?.ticketRequestConcerns?.[0]?.issue_Handler === null ? (
                        <Typography sx={{ fontSize: "14px", color: theme.palette.warning.main, fontStyle: "italic" }}>Issue handler not yet assigned</Typography>
                      ) : (
                        <Stack gap={0.5}>
                          <Typography sx={{ fontSize: "14px" }}>{data?.ticketRequestConcerns?.[0]?.issue_Handler}</Typography>
                          <Typography sx={{ fontSize: "14px", color: theme.palette.text.secondary }}>{data?.ticketRequestConcerns?.[0]?.department_Name}</Typography>
                          <Typography sx={{ fontSize: "14px", color: theme.palette.text.secondary }}>{data?.ticketRequestConcerns?.[0]?.channel_Name}</Typography>
                        </Stack>
                      )}
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

                      {data?.ticketRequestConcerns?.[0]?.issue_Handler === null ? (
                        <Typography sx={{ fontSize: "14px", color: theme.palette.warning.main, fontStyle: "italic" }}>Category not yet assigned</Typography>
                      ) : (
                        <Typography sx={{ fontSize: "14px" }}>{data?.ticketRequestConcerns?.[0]?.category_Description}</Typography>
                      )}
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

                      {data?.ticketRequestConcerns?.[0]?.issue_Handler === null ? (
                        <Typography sx={{ fontSize: "14px", color: theme.palette.warning.main, fontStyle: "italic" }}>Sub category not yet assigned</Typography>
                      ) : (
                        <Typography sx={{ fontSize: "14px" }}>{data?.ticketRequestConcerns?.[0]?.subCategory_Description}</Typography>
                      )}
                    </Stack>
                  </Stack>
                </Stack>

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
                              {isImageFile(fileName.name) && (
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => handleViewImage(fileName)} // View image in dialog
                                  style={{ background: "none" }}
                                >
                                  {viewLoading ? <CircularProgress size={14} /> : <VisibilityOutlined />}
                                </IconButton>
                              )}

                              <Tooltip title="Download">
                                {downloadLoading ? (
                                  <CircularProgress size={14} />
                                ) : (
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => handleDownloadAttachment(fileName)}
                                    style={{
                                      background: "none",
                                    }}
                                  >
                                    <FileDownloadOutlined />
                                  </IconButton>
                                )}
                              </Tooltip>
                            </Box>
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  )}

                  <Controller
                    control={control}
                    name="RequestAttachmentsFiles"
                    render={({ field: { onChange, value } }) => (
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".png,.jpg,.jpeg,.docx"
                        onChange={(event) => {
                          if (ticketAttachmentId) {
                            const files = Array.from(event.target.files);
                            files[0].ticketAttachmentId = ticketAttachmentId;

                            onChange([...files, ...value.filter((item) => item.ticketAttachmentId !== ticketAttachmentId)]);

                            setAttachments((prevFiles) => [
                              ...prevFiles.filter((item) => item.ticketAttachmentId !== ticketAttachmentId),
                              {
                                ticketAttachmentId: ticketAttachmentId,
                                name: files[0].name,
                                size: (files[0].size / (1024 * 1024)).toFixed(2),
                              },
                            ]);

                            fileInputRef.current.value = "";
                            setTicketAttachmentId(null);
                          } else {
                            handleAttachments(event);
                            const files = Array.from(event.target.files);

                            const uniqueNewFiles = files.filter((item) => !value.some((file) => file.name === item.name));

                            onChange([...value, ...uniqueNewFiles]);
                            fileInputRef.current.value = "";
                          }
                        }}
                        hidden
                        multiple={!!ticketAttachmentId}
                      />
                    )}
                  />
                </Stack>
              </Stack> */}

              <Stack>
                <Typography variant="h5" sx={{ color: theme.palette.text.main, fontWeight: "700", fontSize: "18px" }}>
                  Timeline History
                </Typography>
              </Stack>

              {/* TIMELINE */}
              <Stack sx={{ width: "100%", height: "auto", background: theme.palette.bgForm.black2, padding: 2, borderRadius: "20px" }}>
                <Timeline
                  position="right"
                  sx={{
                    [`& .${timelineOppositeContentClasses.root}`]: {
                      flex: 0.2,
                      alignItems: "center",
                    },
                  }}
                >
                  {/* Upcoming History */}
                  {historyData?.value?.[0]?.upComingApprovers?.map((item, index) => (
                    <TimelineItem key={index}>
                      <TimelineOppositeContent color="text.secondary" sx={{ fontSize: "13px" }}>
                        <Stack direction="row">
                          <AccessTimeOutlined sx={{ fontSize: "20px", color: "text.secondary" }} />
                          <Typography sx={{ fontSize: "13px" }}>{moment(item.transaction_Date).format("llll")}</Typography>
                        </Stack>
                      </TimelineOppositeContent>

                      <TimelineSeparator>
                        <TimelineDot color="grey" />
                        <TimelineConnector />
                      </TimelineSeparator>

                      <TimelineContent>
                        <Typography
                          component="span"
                          sx={{
                            fontSize: "19px",
                            fontWeight: 900,
                            color: theme.palette.text.secondary,
                          }}
                        >
                          {item.request}
                        </Typography>

                        <Typography color="text.secondary" sx={{ fontSize: "15px" }}>
                          {item.status}
                        </Typography>

                        <Stack direction="row" gap={0.5} mt={1} sx={{ alignItems: "center" }}>
                          <PersonOutlineOutlined sx={{ fontSize: "20px", color: theme.palette.text.main }} />
                          <Typography sx={{ fontSize: "14px", fontStyle: "italic", fontWeight: 500, color: theme.palette.text.main }}>{item.transacted_By}</Typography>
                        </Stack>

                        <Stack gap={0} marginTop={2}>
                          <Typography color="text.secondary" sx={{ fontSize: "15px", fontWeight: "500", color: theme.palette.text.main }}>
                            {item.remarks ? "Reason: " : ""}
                          </Typography>
                          <Typography color="text.secondary" sx={{ fontSize: "15px", fontWeight: "500", color: theme.palette.text.secondary }}>
                            {item.remarks ? item.remarks : ""}
                          </Typography>
                        </Stack>
                      </TimelineContent>
                    </TimelineItem>
                  ))}

                  {/* Ticket History */}
                  {historyData?.value?.[0]?.getTicketHistoryConcerns?.map((item, index) => (
                    <TimelineItem key={index}>
                      <TimelineOppositeContent color="text.secondary" sx={{ fontSize: "13px" }}>
                        <Stack direction="row">
                          {/* <AccessTimeOutlined sx={{ fontSize: "20px", color: "text.secondary" }} /> */}
                          <Typography sx={{ fontSize: "13px" }}>{moment(item.transaction_Date).format("llll")}</Typography>
                        </Stack>
                      </TimelineOppositeContent>

                      <TimelineSeparator>
                        <TimelineDot color={item.request === "Rejected" ? "error" : item.request === "Disapprove" ? "error" : item.request === "Cancel" ? "error" : "success"} />
                        <TimelineConnector />
                      </TimelineSeparator>

                      <TimelineContent>
                        <Typography
                          component="span"
                          sx={{
                            fontSize: "17px",
                            fontWeight: 900,
                            color:
                              item.request === "Rejected"
                                ? theme.palette.error.main
                                : item.request === "Disapprove"
                                ? theme.palette.error.main
                                : item.request === "Cancel"
                                ? theme.palette.error.main
                                : theme.palette.success.main,
                          }}
                        >
                          {item.request}
                        </Typography>

                        <Typography color="text.secondary" sx={{ fontSize: "15px" }}>
                          {item.status}
                        </Typography>

                        <Stack direction="row" gap={0.5} mt={1} sx={{ alignItems: "center" }}>
                          <PersonOutlineOutlined sx={{ fontSize: "20px", color: theme.palette.text.main }} />
                          <Typography sx={{ fontSize: "14px", fontStyle: "italic", fontWeight: 500, color: theme.palette.text.main }}>{item.transacted_By}</Typography>
                        </Stack>

                        <Stack gap={0} marginTop={2}>
                          <Typography color="text.secondary" sx={{ fontSize: "15px", fontWeight: "700" }}>
                            {item.remarks ? "Reason: " : ""}
                          </Typography>
                          <Typography color="text.secondary" sx={{ fontSize: "15px", fontWeight: "700", color: theme.palette.error.main }}>
                            {item.remarks ? item.remarks : ""}
                          </Typography>
                        </Stack>
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              </Stack>
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions></DialogActions>
      </Dialog>

      {/* Dialog to view image */}
      <Dialog fullWidth maxWidth="md" open={isViewDialogOpen} onClose={handleViewClose}>
        <DialogContent sx={{ height: "auto" }}>{selectedImage && <img src={selectedImage} alt="Preview" style={{ width: "100%" }} />}</DialogContent>
        <DialogActions>
          <Button onClick={handleViewClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ConcernHistory;
