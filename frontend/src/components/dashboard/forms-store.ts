import { create } from "zustand";

export type ProjectForm = {
  id: string;
  projectId: string;
  name: string;
  emails: string[];
  createdAt: string;
};

type CreateFormInput = {
  projectId: string;
  name: string;
  emails: string[];
};

type FormsStore = {
  forms: ProjectForm[];
  addForm: (input: CreateFormInput) => ProjectForm;
  getForm: (formId: string) => ProjectForm | undefined;
  getProjectForms: (projectId: string) => ProjectForm[];
  updateFormEmails: (formId: string, emails: string[]) => void;
};

function createFormId() {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < 8; i += 1) {
    id += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return id;
}

export function getFormEndpoint(formId: string) {
  return `https://api.questbase.io/f/${formId}`;
}

export const useFormsStore = create<FormsStore>((set, get) => ({
  forms: [],

  addForm(input) {
    const existingIds = new Set(get().forms.map((form) => form.id));
    let id = createFormId();
    while (existingIds.has(id)) {
      id = createFormId();
    }

    const form: ProjectForm = {
      id,
      projectId: input.projectId,
      name: input.name.trim(),
      emails: input.emails.map((email) => email.trim().toLowerCase()),
      createdAt: new Date().toISOString(),
    };

    set((state) => ({ forms: [form, ...state.forms] }));
    return form;
  },

  getForm(formId) {
    return get().forms.find((form) => form.id === formId);
  },

  getProjectForms(projectId) {
    return get().forms.filter((form) => form.projectId === projectId);
  },

  updateFormEmails(formId, emails) {
    set((state) => ({
      forms: state.forms.map((form) =>
        form.id === formId
          ? {
              ...form,
              emails: emails.map((email) => email.trim().toLowerCase()),
            }
          : form,
      ),
    }));
  },
}));
