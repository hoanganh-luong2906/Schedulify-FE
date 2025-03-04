"use client";

import ContainedButton from "@/commons/button-contained";
import { useAppContext } from "@/context/app_provider";
import useNotify from "@/hooks/useNotify";
import CloseIcon from "@mui/icons-material/Close";
import {
  Dialog,
  FormControl,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Select,
  MenuItem,
  TextField,
  Typography,
  DialogContent,
  Grid,
  FormHelperText,
} from "@mui/material";
import { useFormik } from "formik";
import dayjs from "dayjs";
import {
  IDepartment,
  ISubject,
  ITeacherDetail,
  IUpdateTeachableSubject,
  IUpdateTeacherRequestBody,
} from "../_libs/constants";
import { useUpdateTeacher } from "../_hooks/useUpdateTeacher";
import { updateTeacherSchema } from "../_libs/teacher_schema";
import React, { useEffect, useState } from "react";
import { KeyedMutator } from "swr";
import {
  fetchTeacherById,
  getDepartmentName,
  getSubjectName,
} from "../_libs/apiTeacher";
import {
  CLASSGROUP_STRING_TYPE,
  TEACHER_GENDER,
  TEACHER_GENDER_TRANSLATOR,
  TEACHER_ROLE,
  TEACHER_ROLE_TRANSLATOR,
  TEACHER_STATUS,
  TEACHER_STATUS_TRANSLATOR,
} from "@/utils/constants";

interface UpdateTeacherFormProps {
  open: boolean;
  onClose: (close: boolean) => void;
  teacherId: number;
  mutate: KeyedMutator<any>;
}
const UpdateTeacherModal = (props: UpdateTeacherFormProps) => {
  const { open, onClose, teacherId, mutate } = props;
  const { sessionToken, selectedSchoolYearId, schoolId } = useAppContext();
  const { editTeacher, isUpdating } = useUpdateTeacher(mutate);
  const [departments, setDepartments] = React.useState<IDepartment[]>([]);
  const [subjects, setSubjects] = React.useState<ISubject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [localFormData, setLocalFormData] =
    useState<IUpdateTeacherRequestBody | null>(null);
  const [teacherData, setTeacherData] = useState<ITeacherDetail | null>(null);

  const formik = useFormik({
    initialValues: {
      "first-name": "",
      "last-name": "",
      abbreviation: "",
      email: "",
      gender: "",
      "department-id": "",
      "date-of-birth": "",
      "school-id": schoolId,
      "teacher-role": "",
      status: "",
      phone: "",
      "is-deleted": false,
      "teachable-subjects": [] as IUpdateTeachableSubject[],
    } as IUpdateTeacherRequestBody,
    validationSchema: updateTeacherSchema,
    onSubmit: async (values) => {
      const success = await editTeacher(teacherId, values);
      if (success) {
        useNotify({
          message: "Cập nhật giáo viên thành công.",
          type: "success",
        });
        handleClose();
        mutate();
      } else {
        useNotify({
          message: "Cập nhật giáo viên thất bại.",
          type: "error",
        });
      }
    },
  });

  useEffect(() => {
    if (!open) {
      setIsLoading(true);
    }
  }, [open]);

  useEffect(() => {
    const loadTeacherData = async () => {
      try {
        const teacherData = await fetchTeacherById(
          schoolId,
          teacherId,
          sessionToken
        );
        const mainSubject = teacherData["teachable-subjects"].find(
          (subject) => subject["is-main"]
        );

        const nonMainSubjects = teacherData["teachable-subjects"].filter(
          (subject) => !subject["is-main"]
        );
        setTeacherData(teacherData);
        formik.setValues({
          "first-name": teacherData["first-name"],
          "last-name": teacherData["last-name"],
          abbreviation: teacherData.abbreviation,
          email: teacherData.email,
          gender: teacherData.gender,
          "department-id": teacherData["department-id"].toString(),
          "date-of-birth": dayjs(teacherData["date-of-birth"]).format(
            "YYYY-MM-DD"
          ),
          "school-id": schoolId,
          "teacher-role": teacherData["teacher-role"],
          status: teacherData.status.toString(),
          phone: teacherData.phone,
          "is-deleted": teacherData["is-deleted"],
        });
        setIsLoading(false);
      } catch (error) {
        useNotify({
          message: "Lỗi khi tải dữ liệu giáo viên",
          type: "error",
        });
        console.error(error);
      }
    };
    const loadDepartments = async () => {
      const data = await getDepartmentName(schoolId, sessionToken);
      if (data.result?.items) {
        setDepartments(data.result.items);
      }
    };

    const loadSubjects = async () => {
      const subjectData = await getSubjectName(
        sessionToken,
        selectedSchoolYearId
      );
      if (subjectData?.status === 200) {
        setSubjects(subjectData.result.items);
        console.log("Subjects loaded:", subjectData.result.items);
      }
    };

    if (open && isLoading) {
      loadTeacherData();
      loadDepartments();
      loadSubjects();
    }
  }, [open, teacherId, sessionToken, schoolId, isLoading]);

  useEffect(() => {
    if (localFormData && open) {
      formik.setValues(localFormData);
    }
  }, [localFormData, open]);

  const handleClose = () => {
    formik.resetForm();
    onClose(false);
  };

  console.log("error", formik.errors);
  console.log("values", formik.values);
  console.log("isValid", formik.isValid);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <div
        id="modal-header"
        className="w-full h-fit flex flex-row justify-between items-center bg-primary-50 p-3"
      >
        <Typography
          variant="h6"
          component="h2"
          className="text-title-medium-strong font-normal opacity-60"
        >
          Cập nhật thông tin giáo viên
        </Typography>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent
          sx={{
            maxHeight: "70vh",
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: "8px",
              display: "none",
            },
            "&::-webkit-scrollbar-track": {
              background: "#f1f1f1",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#888",
              borderRadius: "4px",
            },
            "-ms-overflow-style": "none",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid
                  item
                  xs={3}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Họ và tên
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    variant="standard"
                    fullWidth
                    placeholder="Nhập Họ"
                    name="first-name"
                    value={formik.values["first-name"]}
                    onChange={formik.handleChange("first-name")}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched["first-name"] &&
                      Boolean(formik.errors["first-name"])
                    }
                    helperText={
                      formik.touched["first-name"] &&
                      formik.errors["first-name"]
                    }
                  />
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    variant="standard"
                    fullWidth
                    placeholder="Nhập Tên"
                    name="last-name"
                    value={formik.values["last-name"]}
                    onChange={formik.handleChange("last-name")}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched["last-name"] &&
                      Boolean(formik.errors["last-name"])
                    }
                    helperText={
                      formik.touched["last-name"] && formik.errors["last-name"]
                    }
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid
                  item
                  xs={3}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Tên viết tắt
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <TextField
                    variant="standard"
                    fullWidth
                    placeholder="Nhập tên viết tắt giáo viên"
                    name="abbreviation"
                    type="text"
                    value={formik.values.abbreviation}
                    onChange={formik.handleChange("abbreviation")}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.abbreviation &&
                      Boolean(formik.errors.abbreviation)
                    }
                    helperText={
                      formik.touched.abbreviation && formik.errors.abbreviation
                    }
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid
                  item
                  xs={3}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Email
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <TextField
                    variant="standard"
                    fullWidth
                    placeholder="Nhập email"
                    name="email"
                    type="email"
                    value={formik.values.email}
                    onChange={formik.handleChange("email")}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={
                      teacherData?.["is-have-account"] 
                        ? "Email không thể chỉnh sửa do giáo viên đã có tài khoản"
                        : formik.touched.email && formik.errors.email
                    }
                    disabled={teacherData?.["is-have-account"]}
                    sx={{
                      "& .Mui-disabled": {
                        WebkitTextFillColor: "#00000061",
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid
                  item
                  xs={3}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Giới tính
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <FormControl component="fieldset">
                    <RadioGroup
                      row
                      name="gender"
                      value={formik.values.gender}
                      onChange={formik.handleChange("gender")}
                    >
                      {TEACHER_GENDER.map((gender) => (
                        <FormControlLabel
                          key={gender.key}
                          value={gender.key}
                          control={<Radio />}
                          label={TEACHER_GENDER_TRANSLATOR[gender.value]}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid
                  item
                  xs={3}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Tổ bộ môn
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <FormControl
                    fullWidth
                    error={
                      formik.touched["department-id"] &&
                      Boolean(formik.errors["department-id"])
                    }
                  >
                    <Select
                      variant="standard"
                      name="department-id"
                      value={formik.values["department-id"]}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 150,
                            overflow: "auto",
                          },
                        },
                      }}
                    >
                      <MenuItem value="">--Chọn tổ bộ môn--</MenuItem>
                      {departments.map((department) => (
                        <MenuItem key={department.id} value={department.id}>
                          {department.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched["department-id"] &&
                      formik.errors["department-id"] && (
                        <FormHelperText className="m-0">
                          {formik.errors["department-id"]}
                        </FormHelperText>
                      )}
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid
                  item
                  xs={3}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Ngày sinh
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <TextField
                    variant="standard"
                    fullWidth
                    name="date-of-birth"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={formik.values["date-of-birth"]}
                    onChange={formik.handleChange("date-of-birth")}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched["date-of-birth"] &&
                      Boolean(formik.errors["date-of-birth"])
                    }
                    helperText={
                      formik.touched["date-of-birth"] &&
                      formik.errors["date-of-birth"]
                    }
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid
                  item
                  xs={3}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Vai trò
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <FormControl component="fieldset">
                    <RadioGroup
                      row
                      name="teacher-role"
                      value={formik.values["teacher-role"]}
                      onChange={formik.handleChange("teacher-role")}
                    >
                      {TEACHER_ROLE.map((role) => (
                        <FormControlLabel
                          key={role.key}
                          value={role.key}
                          control={<Radio />}
                          label={TEACHER_ROLE_TRANSLATOR[role.value]}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid
                  item
                  xs={3}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Trạng thái
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <FormControl fullWidth>
                    <Select
                      variant="standard"
                      name="status"
                      value={formik.values.status}
                      onChange={(event) =>
                        formik.setFieldValue("status", event.target.value)
                      }
                      onBlur={formik.handleBlur}
                    >
                      {TEACHER_STATUS.map((status) => (
                        <MenuItem key={status.value} value={status.value}>
                          {TEACHER_STATUS_TRANSLATOR[status.value]}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid
                  item
                  xs={3}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Số điện thoại
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <TextField
                    variant="standard"
                    fullWidth
                    placeholder="Nhập số điện thoại"
                    name="phone"
                    type="text"
                    value={formik.values.phone}
                    onChange={formik.handleChange("phone")}
                    onBlur={formik.handleBlur}
                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                    helperText={formik.touched.phone && formik.errors.phone}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <div className="w-full flex flex-row justify-end items-center gap-2 bg-basic-gray-hover p-3">
          <ContainedButton
            title="Huỷ"
            onClick={handleClose}
            disableRipple
            styles="!bg-basic-gray-active !text-basic-gray !py-1 px-4"
          />
          <ContainedButton
            title="Cập nhật"
            disableRipple
            type="submit"
            disabled={!formik.isValid}
            styles="bg-primary-300 text-white !py-1 px-4"
          />
        </div>
      </form>
    </Dialog>
  );
};

export default UpdateTeacherModal;
