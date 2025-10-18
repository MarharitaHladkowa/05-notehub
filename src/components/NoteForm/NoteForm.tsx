import { useId } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import css from "./NoteForm.module.css";
import type { FormikHelpers } from "formik";
import { useMutation } from "@tanstack/react-query";
import { createNote } from "../../Services/noteServices";
import type { NewNote } from "../../types/note";

interface OrderFormValues {
  title: string;
  content: string;
  tag: "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
}
const initialValues: OrderFormValues = {
  title: "",
  content: "",
  tag: "Todo",
};
const OrderSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  content: Yup.string()
    .min(5, "Too Short!")
    .max(500, "Too Long!")
    .required("Required"),
  tag: Yup.string()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
    .required("Required"),
});

interface NoteFormProps {
  onClose: () => void;
}

export default function NoteForm({ onClose }: NoteFormProps) {
  const fieldId = useId();
  const { mutate, isPending } = useMutation({
    mutationFn: async (newNote: NewNote) => {
      createNote(newNote);
    },
    onSuccess() {
      onClose();
    },
    onError(error) {},
  });
  const handleSubmit = async (
    values: OrderFormValues,
    actions: FormikHelpers<OrderFormValues>
  ) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    mutate(values);
    actions.resetForm();
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={OrderSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, isValid, dirty }) => {
        return (
          <Form className={css.form}>
            <div className={css.formGroup}>
              <ErrorMessage name="title" component="p" className={css.error} />
              <label htmlFor={`${fieldId}-title`}>Title</label>
              <Field
                id={`${fieldId}-title`}
                type="text"
                name="title"
                className={css.input}
              />
            </div>

            <div className={css.formGroup}>
              <ErrorMessage
                name="content"
                component="p"
                className={css.error}
              />
              <label htmlFor={`${fieldId}-content`}>Content</label>
              <Field
                as="textarea"
                id={`${fieldId}-content`}
                name="content"
                rows={8}
                className={css.textarea}
              />
            </div>

            <div className={css.formGroup}>
              <label htmlFor={`${fieldId}-tag`}>Tag</label>
              <ErrorMessage name="tag" component="p" className={css.error} />
              <Field
                as="select"
                id={`${fieldId}-tag`}
                name="tag"
                className={css.select}
              >
                <option value="Todo">Todo</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Meeting">Meeting</option>
                <option value="Shopping">Shopping</option>
              </Field>
            </div>

            <div className={css.actions}>
              <button
                type="button"
                onClick={onClose}
                className={css.cancelButton}
              >
                Cancel
              </button>

              <button
                type="submit"
                className={css.submitButton}
                disabled={isSubmitting || !isValid || !dirty}
              >
                {isSubmitting ? "Submitting..." : "Create note"}
              </button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}
