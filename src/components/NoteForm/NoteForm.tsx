import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import type { NewNote, NoteTag } from "../../types/note";
import css from "./NoteForm.module.css";

interface NoteFormProps {
  onSubmit: (values: NewNote) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const NoteSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Min 3 characters")
    .max(50, "Max 50 characters")
    .required("Title is required"),
  content: Yup.string().max(500, "Max 500 characters"),
  tag: Yup.string()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
    .required("Tag is required"),
});

const initialValues: NewNote = {
  title: "",
  content: "",
  tag: "Todo" as NoteTag,
};

export default function NoteForm({
  onSubmit,
  onCancel,
  isSubmitting,
}: NoteFormProps) {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={NoteSchema}
      onSubmit={(values) => onSubmit(values)}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field
            id="title"
            type="text"
            name="title"
            className={css.input}
          />
          <ErrorMessage
            name="title"
            component="span"
            className={css.error}
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="content">Content</label>
          <Field
            id="content"
            as="textarea"
            name="content"
            rows={8}
            className={css.textarea}
          />
          <ErrorMessage
            name="content"
            component="span"
            className={css.error}
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="tag">Tag</label>
          <Field
            id="tag"
            as="select"
            name="tag"
            className={css.select}
          >
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage
            name="tag"
            component="span"
            className={css.error}
          />
        </div>

        <div className={css.actions}>
          <button
            type="button"
            className={css.cancelButton}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={css.submitButton}
            disabled={isSubmitting}
          >
            Create note
          </button>
        </div>
      </Form>
    </Formik>
  );
}
