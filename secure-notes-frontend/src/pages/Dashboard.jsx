import { useEffect, useState } from "react"
import api from "../api/api"
import { useNavigate } from "react-router-dom"


function Dashboard() {

  const [notes, setNotes] = useState([])
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const editNote = (note) => {
  setTitle(note.title)
  setContent(note.content)
}

  const navigate = useNavigate()
  
  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {

      const res = await api.get("/notes")
      setNotes(res.data)

    } catch (err) {

      console.log(err)

    }
  }

  const createNote = async (e) => {

    e.preventDefault()

    try {

      await api.post("/notes/", {
        title: title,
        content: content
      })

      setTitle("")
      setContent("")

      fetchNotes()

    } catch (err) {

      console.log(err)

    }

  }

  const deleteNote = async (id) => {

    try {

      await api.delete(`/notes/${id}`)
      fetchNotes()

    } catch (err) {

      console.log(err)

    }

  }

  const logout = () => {

    localStorage.removeItem("token")
    navigate("/")

  }
  const filteredNotes = notes.filter(note =>
  note.title.toLowerCase().includes(search.toLowerCase()) ||
  note.content.toLowerCase().includes(search.toLowerCase())
)
  return (

    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}

      <div className="w-64 bg-white border-r p-6 flex flex-col justify-between">

        <div>

          <h1 className="text-xl font-bold mb-8">
            Secure Notes
          </h1>

          <p className="text-gray-500 text-sm mb-4">
            Workspace
          </p>

          <div className="space-y-2">

            <div className="p-2 rounded hover:bg-gray-100 cursor-pointer">
              My Notes
            </div>

            <div className="p-2 rounded hover:bg-gray-100 cursor-pointer">
              Recent
            </div>

          </div>

        </div>

        <button
          onClick={logout}
          className="mt-10 text-red-500 hover:text-red-600"
        >
          Logout
        </button>

      </div>
      

      {/* Main Content */}

      <div className="flex-1 p-10">

        <h2 className="text-2xl font-semibold mb-6">
          My Notes
        </h2>

        {/* Create Note */}

        <form
          onSubmit={createNote}
          className="bg-white p-6 rounded-lg shadow mb-8 max-w-xl"
        >

          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-lg font-semibold mb-3 outline-none"
            required
          />

          <textarea
            placeholder="Write your note..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="3"
            className="w-full outline-none text-gray-600"
            required
          />

          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Add Note
          </button>

        </form>
        <input
  placeholder="Search notes..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="border p-2 rounded w-full mb-6"
/>
{filteredNotes.length === 0 && (
  <div className="text-gray-400 text-center mt-10">
    No notes yet. Start writing your first note ✨
  </div>
)}


        {/* Notes Grid */}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

  {filteredNotes.map((note) => (
    <div key={note.id} className="bg-white p-4 rounded shadow mb-4">

      <h3 className="font-bold text-lg">
        {note.title}
      </h3>

      <p className="text-gray-700 mt-2">
        {note.content}
      </p>

      <div className="flex gap-3 mt-3">

        <button
          onClick={() => deleteNote(note.id)}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Delete
        </button>

        <button
          onClick={() => editNote(note)}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Edit
        </button>

      </div>

    </div>
  ))}

</div>

      </div>

    </div>

  )
}

export default Dashboard