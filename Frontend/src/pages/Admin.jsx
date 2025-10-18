import React, { useEffect, useState } from 'react'
import api from '../utils/api'

const Admin = () => {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [users, setUsers] = useState([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [usersError, setUsersError] = useState('')

  useEffect(() => {
    if (activeSection !== 'users') return
    let isCancelled = false
    const fetchUsers = async () => {
      setUsersLoading(true)
      setUsersError('')
      try {
        const { data } = await api.get('/admin/users')
        if (!isCancelled) setUsers(Array.isArray(data) ? data : (data.users || []))
      } catch (err) {
        if (!isCancelled) setUsersError(err.message || 'Error fetching users')
      } finally {
        if (!isCancelled) setUsersLoading(false)
      }
    }
    fetchUsers()
    return () => { isCancelled = true }
  }, [activeSection])

  const NavButton = ({ id, label }) => (
    <button
      onClick={() => setActiveSection(id)}
      className={`text-left px-3 py-2.5 w-full border-none rounded-md cursor-pointer transition-colors ${
        activeSection === id 
          ? 'bg-gray-800 text-white font-semibold' 
          : 'bg-transparent text-gray-300 font-medium hover:bg-gray-700 hover:text-white'
      }`}
    >
      {label}
    </button>
  )

  const SectionContainer = ({ children }) => (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      {children}
    </div>
  )

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-gray-300 p-4 flex flex-col gap-3">
        <div className="text-lg font-bold mb-2">Admin Panel</div>
        <NavButton id="dashboard" label="Dashboard" />
        <NavButton id="users" label="Users" />
        <NavButton id="events" label="Events" />
        <NavButton id="settings" label="Settings" />
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="m-0 text-2xl font-semibold text-gray-800">{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}</h1>
          <div>
            <button className="px-3 py-2 rounded-md border border-gray-300 bg-white cursor-pointer hover:bg-gray-50 transition-colors">Logout</button>
          </div>
        </div>

        {activeSection === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <SectionContainer>
              <div className="text-xs text-gray-500 mb-1">Total Users</div>
              <div className="text-3xl font-bold text-gray-800">1,248</div>
            </SectionContainer>
            <SectionContainer>
              <div className="text-xs text-gray-500 mb-1">Active Events</div>
              <div className="text-3xl font-bold text-gray-800">32</div>
            </SectionContainer>
            <SectionContainer>
              <div className="text-xs text-gray-500 mb-1">Tickets Sold</div>
              <div className="text-3xl font-bold text-gray-800">5,412</div>
            </SectionContainer>
          </div>
        )}

        {activeSection === 'users' && (
          <SectionContainer>
            <div className="flex justify-between mb-3">
              <input 
                placeholder="Search users..." 
                className="px-2 py-2 rounded-md border border-gray-300 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              />
              <button className="px-3 py-2 rounded-md border border-gray-300 bg-gray-900 text-white cursor-pointer hover:bg-gray-800 transition-colors">Add User</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left p-2 border-b border-gray-200 font-semibold text-gray-700">Name</th>
                    <th className="text-left p-2 border-b border-gray-200 font-semibold text-gray-700">Email</th>
                    <th className="text-left p-2 border-b border-gray-200 font-semibold text-gray-700">Role</th>
                    <th className="text-left p-2 border-b border-gray-200 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {usersLoading && (
                    <tr><td colSpan={4} className="p-3 text-center text-gray-500">Loading users...</td></tr>
                  )}
                  {usersError && !usersLoading && (
                    <tr><td colSpan={4} className="p-3 text-center text-red-600">{usersError}</td></tr>
                  )}
                  {!usersLoading && !usersError && users.length === 0 && (
                    <tr><td colSpan={4} className="p-3 text-center text-gray-500">No users found</td></tr>
                  )}
                  {!usersLoading && !usersError && users.map(user => (
                    <tr key={user.id || user._id} className="hover:bg-gray-50">
                      <td className="p-2 border-b border-gray-100">{user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim()}</td>
                      <td className="p-2 border-b border-gray-100">{user.email}</td>
                      <td className="p-2 border-b border-gray-100">
                        <select
                          value={user.role || 'user'}
                          onChange={(e) => {
                            const nextRole = e.target.value
                            const currentUserId = user.id || user._id
                            setUsers(prev => prev.map(u => {
                              const userId = u.id || u._id
                              return userId === currentUserId ? { ...u, role: nextRole } : u
                            }))
                          }}
                          className="px-2 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="user">user</option>
                          <option value="moderator">moderator</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>
                      <td className="p-2 border-b border-gray-100">
                        <button
                          className="mr-2 px-2 py-1 rounded border border-green-500 bg-green-50 text-green-700 cursor-pointer hover:bg-green-100 transition-colors"
                          onClick={async () => {
                            const userId = user.id || user._id
                            const currentRole = user.role || 'user'
                            console.log('Updating role for user:', userId, 'to role:', currentRole)
                            try {
                              await api.put(`/admin/users/${userId}/role`, { role: currentRole })
                              alert('Role updated')
                            } catch (err) {
                              console.error('Role update error:', err)
                              alert('Failed to update role: ' + err.message)
                            }
                          }}
                        >Save</button>
                        <button className="px-2 py-1 rounded border border-red-400 bg-red-50 text-red-700 cursor-pointer hover:bg-red-100 transition-colors">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionContainer>
        )}

        {activeSection === 'events' && (
          <SectionContainer>
            <div className="flex justify-between mb-3">
              <input 
                placeholder="Search events..." 
                className="px-2 py-2 rounded-md border border-gray-300 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              />
              <button className="px-3 py-2 rounded-md border border-gray-300 bg-gray-900 text-white cursor-pointer hover:bg-gray-800 transition-colors">Create Event</button>
            </div>
            <ul className="list-none p-0 m-0 space-y-2">
              {[{ id: 1, name: 'Hackathon 2025', date: '2025-11-20' }, { id: 2, name: 'Tech Summit', date: '2025-12-05' }].map(evt => (
                <li key={evt.id} className="flex justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div>
                    <div className="font-semibold text-gray-800">{evt.name}</div>
                    <div className="text-xs text-gray-500">{evt.date}</div>
                  </div>
                  <div>
                    <button className="mr-2 px-2 py-1 rounded border border-gray-300 bg-white text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors">Edit</button>
                    <button className="px-2 py-1 rounded border border-red-400 bg-red-50 text-red-700 cursor-pointer hover:bg-red-100 transition-colors">Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </SectionContainer>
        )}

        {activeSection === 'settings' && (
          <SectionContainer>
            <div className="grid gap-3 max-w-md">
              <label className="grid gap-1.5">
                <span className="text-sm font-medium text-gray-700">Organization Name</span>
                <input 
                  placeholder="Enter name" 
                  className="px-2 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                />
              </label>
              <label className="grid gap-1.5">
                <span className="text-sm font-medium text-gray-700">Support Email</span>
                <input 
                  type="email" 
                  placeholder="support@example.com" 
                  className="px-2 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                />
              </label>
              <button className="w-fit px-3 py-2 rounded border border-green-500 bg-green-50 text-green-700 cursor-pointer hover:bg-green-100 transition-colors">Save Changes</button>
            </div>
          </SectionContainer>
        )}
      </main>
    </div>
  )
}

export default Admin;