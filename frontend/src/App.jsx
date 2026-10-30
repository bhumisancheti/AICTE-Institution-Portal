
import { useEffect, useState } from "react";
import {
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication,
} from "./api/applications";

const emptyForm = {
  institutionName: "",
  address: "",
  state: "",
  affiliation: "",
  applicationType: "New Approval",
  academicYear: "2027-28",
  courses: "",
  intake: "",
};

function App() {
  const [applications, setApplications] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const loggedInUser = JSON.parse(localStorage.getItem("authUser") || "{}");
const userDisplayName = loggedInUser.name || "Institution User";
const institutionDisplayName = loggedInUser.institutionName || "Institution";
  const loadApplications = async () => {
    try {
      const data = await getApplications();
      setApplications(
        data.map((app) => ({
          ...app,
          id: app._id || app.id,
        }))
      );
    } catch (error) {
      setMessage("Could not load applications. Check that the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    loadApplications();
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      window.location.replace("/login");
    }
  }, []);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  
const handleSubmit = async (event) => {
  event.preventDefault();

  const isSubmitting =
    event.nativeEvent.submitter?.value === "submit";

  if (isSubmitting) {
    const requiredFields = [
      ["institutionName", "Institution Name"],
      ["address", "Address"],
      ["state", "State"],
      ["affiliation", "Affiliation"],
      ["courses", "Courses"],
      ["intake", "Intake"],
    ];

    const missingField = requiredFields.find(
      ([field]) => !String(form[field] ?? "").trim()
    );

    if (missingField) {
      setMessage(
        `Please fill in the ${missingField[1]} field before submitting.`
      );
      return;
    }

    if (!Number.isFinite(Number(form.intake)) || Number(form.intake) < 1) {
      setMessage("Intake must be a valid number of at least 1.");
      return;
    }
  }

  setSaving(true);
  setMessage("");

  try {
    const applicationData = {
      institutionName: form.institutionName.trim(),
      address: form.address.trim(),
      state: form.state.trim(),
      affiliation: form.affiliation.trim(),
      applicationType: form.applicationType,
      academicYear: form.academicYear,
      courses: form.courses.trim(),
      intake: form.intake === "" ? null : Number(form.intake),
      status: isSubmitting ? "Submitted" : "Draft",
    };

    let savedApplication;

    if (editingId) {
      savedApplication = await updateApplication(
        editingId,
        applicationData
      );
      setMessage(
        applicationData.status === "Submitted"
          ? "Application submitted successfully!"
          : "Draft updated successfully!"
      );
    } else {
      savedApplication = await createApplication(applicationData);
      setMessage(
        applicationData.status === "Submitted"
          ? "Application submitted successfully!"
          : "Draft saved successfully to MongoDB!"
      );
    }

    if (selectedFile) {
      const { uploadDocument } = await import("./api/applications");
      const uploadResult = await uploadDocument(
        savedApplication._id || savedApplication.id,
        selectedFile
      );

      if (!uploadResult.success) {
        throw new Error("Application saved, but document upload failed.");
      }

      setMessage(
        applicationData.status === "Submitted"
          ? "Application submitted and document uploaded successfully!"
          : "Draft saved and document uploaded successfully!"
      );
    }

    setForm(emptyForm);
    setEditingId(null);
    setSelectedFile(null);
    await loadApplications();
  } catch (error) {
    setMessage(
      error.response?.data?.message ||
        error.message ||
        "Could not save the application. Please try again."
    );
  } finally {
    setSaving(false);
  }
};


  const handleEdit = (application) => {
  setEditingId(application.id);

  setForm({
    institutionName: application.institutionName || "",
    address: application.address || "",
    state: application.state || "",
    affiliation: application.affiliation || "",
    applicationType: application.applicationType || "New Approval",
    academicYear: application.academicYear || "2027-28",
    courses: application.courses || "",
intake: application.intake ?? "",
  });

  setMessage("");
  window.scrollTo({ top: 0, behavior: "smooth" });
};
  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setMessage("");
  };

  const handleDelete = async (application) => {
    const confirmed = window.confirm(
      `Delete the draft for "${application.institutionName}"? This cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await deleteApplication(application.id);

      if (editingId === application.id) {
        handleCancelEdit();
      }

      setMessage("Draft deleted successfully.");
      await loadApplications();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Could not delete the draft. Please try again."
      );
    }
  };

  const totalApplications = applications.length;
  const drafts = applications.filter((app) => app.status === "Draft").length;
  const submitted = applications.filter(
    (app) => app.status === "Submitted"
  ).length;
  const underReview = applications.filter(
    (app) => app.status === "Under Review"
  ).length;

  const statusClass = (status) => {
  switch (status) {
    case "Approved":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200";
    case "Rejected":
      return "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200";
    case "Submitted":
      return "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200";
    case "Under Review":
      return "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200";
    case "Returned for Corrections":
      return "bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-200";
    case "Draft":
      return "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200";
    default:
      return "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200";
  }
};

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      
<header className="sticky top-0 z-30 border-b border-slate-200 bg-white shadow-sm">
  <div className="flex min-h-[76px] items-center justify-between px-5 sm:px-8">
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-700 to-indigo-600 text-xl font-extrabold text-white shadow-md">
        A
      </div>
      <div>
        <h1 className="text-lg font-extrabold tracking-tight text-slate-900">
          AICTE Smart Approval Portal
        </h1>
        <p className="text-xs font-medium text-slate-500">
          Institution Workspace
        </p>
      </div>
    </div>

    <div className="flex items-center gap-3 sm:gap-5">
      <div className="hidden items-center gap-3 sm:flex">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700 ring-2 ring-indigo-50">
          IU
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-slate-800">
  {loggedInUser.name || loggedInUser.institutionName || "Institution User"}
</p>
          <p className="text-xs text-slate-500">Institution Account</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          localStorage.removeItem("authToken");
          localStorage.removeItem("authUser");
          window.location.href = "/login";
        }}
        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg"
      >
        <span aria-hidden="true">↪</span>
        Logout
      </button>
    </div>
  </div>
</header>

      <div className="flex min-h-[calc(100vh-81px)] bg-slate-100">
  <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-950 text-white md:flex">
    <div className="border-b border-slate-700 px-6 py-6">
      <h2 className="text-xl font-bold">AICTE Portal</h2>
      <p className="mt-1 text-xs text-slate-400">
        Institution Workspace
      </p>
    </div>

    <nav className="flex-1 space-y-3 px-4 py-6">
      <a
  href="/"
  className="flex items-center gap-3 rounded-lg border border-indigo-400/20 bg-indigo-500/20 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-500/30"
>
  <span className="text-lg">▦</span>
  Dashboard
</a>

<a
  href="#applications"
  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-300 transition-all hover:bg-slate-800 hover:text-white"
>
  <span className="text-lg">▤</span>
  My Applications
</a>

<a
  href="#profile"
  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-300 transition-all hover:bg-slate-800 hover:text-white"
>
  <span className="text-lg">⌂</span>
  Institution Profile
</a>
    </nav>

    <div className="border-t border-slate-700 px-6 py-4 text-xs text-slate-400">
      AICTE Approval Workflow
    </div>
  </aside>

  <div className="min-w-0 flex-1">
    <main className="mx-auto w-full max-w-[1250px] space-y-7 px-5 py-7 sm:px-7 lg:px-10">
        <section id="dashboard" className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-r from-white via-indigo-50/60 to-blue-50 p-8 shadow-sm">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-indigo-600">
  Institution Dashboard
</p>

<h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
  {`Hello, ${userDisplayName}! 👋`}
</h2>
          <p className="mt-1 text-slate-500">
            Track your applications, manage institution details, and monitor approval progress in one place.
          </p>
        </section>

        {message && (
          <div
            role="status"
            className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-800"
          >
            {message}
          </div>
        )}

        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
  {[
    {
      label: "Total Applications",
      value: totalApplications,
      icon: "▤",
      color: "text-indigo-600",
      bg: "bg-indigo-100",
    },
    {
      label: "Drafts",
      value: drafts,
      icon: "📝",
      color: "text-slate-700",
      bg: "bg-slate-100",
    },
    {
      label: "Submitted",
      value: submitted,
      icon: "✓",
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Under Review",
      value: underReview,
      icon: "◷",
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
  ].map((stat) => (
    <div
      key={stat.label}
      className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-500">{stat.label}</p>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl font-bold ${stat.color} ${stat.bg}`}>
          {stat.icon}
        </div>
      </div>
      <p className={`mt-4 text-3xl font-extrabold ${stat.color}`}>
        {stat.value}
      </p>
    </div>
  ))}
</section>

        <section id="profile" className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
          <div className="mb-6 border-b border-slate-100 pb-4">
  <h3 className="text-xl font-bold tracking-tight text-slate-900">
    Institution Profile & Application
  </h3>
  <p className="mt-1 text-sm text-slate-500">
    Enter your institution information and application details below.
  </p>
</div>
          
<div className="md:col-span-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-5">
  <h4 className="font-semibold text-slate-800">
    Supporting Documents
  </h4>

  <p className="mt-1 text-sm text-slate-500">
    Select a PDF, DOC, or DOCX file (maximum 5 MB).
  </p>

  <input
    type="file"
    accept=".pdf,.doc,.docx"
    onChange={(event) => {
      const file = event.target.files?.[0];

      if (!file) {
        setSelectedFile(null);
        return;
      }

      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!allowedTypes.includes(file.type)) {
        alert("Please select a PDF, DOC, or DOCX file.");
        event.target.value = "";
        setSelectedFile(null);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("File size must not exceed 5 MB.");
        event.target.value = "";
        setSelectedFile(null);
        return;
      }

      setSelectedFile(file);
    }}
    className="mt-4 block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-100 file:px-4 file:py-2 file:font-medium file:text-indigo-700 hover:file:bg-indigo-200"
  />

  {selectedFile && (
    <p className="mt-3 text-sm text-green-700">
      Selected file: {selectedFile.name}
    </p>
  )}
</div>


          <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-3">
            <div>
  <label
    htmlFor="institutionName"
    className="mb-2 block text-sm font-medium"
  >
    Institution Name
  </label>

  <input
    id="institutionName"
    name="institutionName"
    type="text"
    value={form.institutionName}
    onChange={handleChange}
    required
    maxLength={150}
    placeholder="Enter institution name"
    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"

  />
</div>
<div>
  <label htmlFor="address" className="mb-2 block text-sm font-medium">
    Address
  </label>
  <input
    id="address"
    name="address"
    type="text"
    value={form.address}
    onChange={handleChange}
    placeholder="Enter institution address"
    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
  />
</div>

<div>
  <label htmlFor="state" className="mb-2 block text-sm font-medium">
    State
  </label>
  <input
    id="state"
    name="state"
    type="text"
    value={form.state}
    onChange={handleChange}
    placeholder="Enter state"
    className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
  />
</div>

<div>
  <label htmlFor="affiliation" className="mb-2 block text-sm font-medium">
    Affiliation
  </label>
  <input
    id="affiliation"
    name="affiliation"
    type="text"
    value={form.affiliation}
    onChange={handleChange}
    placeholder="e.g., GGSIPU"
    className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
  />
</div>
<div>
  <label htmlFor="courses" className="mb-2 block text-sm font-medium">
    Courses
  </label>
  <input
    id="courses"
    name="courses"
    type="text"
    value={form.courses}
    onChange={handleChange}
    placeholder="e.g., B.Tech CSE, B.Tech ECE"
    className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
  />
</div>

<div>
  <label htmlFor="intake" className="mb-2 block text-sm font-medium">
    Intake
  </label>
  <input
    id="intake"
    name="intake"
    type="number"
    min="1"
    value={form.intake}
    onChange={handleChange}
    placeholder="e.g., 120"
    className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
  />
</div>
            <div>
              <label
                htmlFor="applicationType"
                className="mb-2 block text-sm font-medium"
              >
                Application Type
              </label>
              <select
                id="applicationType"
                name="applicationType"
                value={form.applicationType}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition-all duration-200 hover:border-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              >
                <option>New Approval</option>
                <option>Extension of Approval</option>
                <option>Increase in Intake</option>
                <option>Course Addition</option>
                <option>Institution Name Change</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="academicYear"
                className="mb-2 block text-sm font-medium"
              >
                Academic Year
              </label>
              <select
                id="academicYear"
                name="academicYear"
                value={form.academicYear}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option>2026-27</option>
                <option>2027-28</option>
                <option>2028-29</option>
                <option>2029-30</option>
              </select>
            </div>

            <div className="flex flex-wrap gap-3 md:col-span-3">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Draft"
                    : "Save as Draft"}
              </button>

              

<button
  type="submit"
  name="action"
  value="submit"
  disabled={saving}
  className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
>
  {saving ? "Submitting..." : "Submit Application"}
</button>


              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="rounded-lg border border-slate-300 px-5 py-2.5 font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
              )}
            </div>
          

          </form>
        </section>

        <section id="applications" className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md">
          <div className="border-b border-slate-200 px-6 py-5">
            <h3 className="text-xl font-bold tracking-tight text-slate-900">
  Application Management
</h3>
<p className="mt-1 text-sm leading-6 text-slate-500">
  View application status, track progress, and manage your saved drafts.
</p>          </div>

          {loading ? (
            <p className="p-6 text-slate-500">Loading applications...</p>
          ) : applications.length === 0 ? (
            <p className="p-6 text-slate-500">
              No applications yet. Create your first draft above.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-600">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Application ID</th>
                    <th className="px-6 py-4 font-semibold">Institution</th>
                    <th className="px-6 py-4 font-semibold">Application Type</th>      
                    
                    <th className="px-6 py-4 font-semibold">Academic Year</th>
                    <th className="px-6 py-4 font-semibold">Courses</th>
<th className="px-6 py-4 font-semibold">Intake</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
<th className="px-6 py-4 font-semibold">Reviewer Comments</th>
<th className="px-6 py-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {applications.map((application) => {
                    const canEdit =
  application.status === "Draft" ||
  application.status === "Returned for Corrections";

                    return (
                      <tr
  key={application.id}
  className="transition-colors duration-150 hover:bg-indigo-50/50 [&>td]:py-5"
>
                        <td className="px-6 py-4 font-mono text-xs text-slate-500">
  {application.id}
</td>
                        <td className="px-6 py-4 font-medium">
                          {application.institutionName}
                        </td>
                        <td className="px-6 py-4">
                          {application.applicationType}
                        </td>
                        <td className="px-6 py-4">
                          {application.academicYear || "2027-28"}
                        </td>
                        <td className="px-6 py-4">
  {application.courses || "—"}
</td>
<td className="px-6 py-4">
  {application.intake ?? "—"}
</td>
                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                              application.status
                            )}`}
                          >
                            {application.status || "Draft"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
  {application.reviewerComments || "No comments yet"}
</td>
                        <td className="px-6 py-4">
                          {canEdit ? (
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => handleEdit(application)}
                                className="rounded-md border border-indigo-200 px-3 py-1.5 font-medium text-indigo-700 hover:bg-indigo-50"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(application)}
                                className="rounded-md border border-red-200 px-3 py-1.5 font-medium text-red-700 hover:bg-red-50"
                              >
                                Delete
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400">
                              Drafts only
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <p className="text-center text-xs text-slate-400">
          Student project demonstration · Not connected to the live AICTE system
        </p>
                  </main>
    </div>
  </div>
</div>
  );
}

export default App;