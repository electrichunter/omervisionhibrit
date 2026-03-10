import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import DashboardCharts from '@/components/Admin/DashboardCharts'

export default async function AdminDashboard() {
    const supabase = await createClient()

    // Checking user session safely again
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Count items
    const { count: postCount } = await supabase.from('posts').select('*', { count: 'exact', head: true })
    const { count: projectCount } = await supabase.from('projects').select('*', { count: 'exact', head: true })

    // Analytics Data Fetching & Aggregation
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5)
    sixMonthsAgo.setDate(1)
    sixMonthsAgo.setHours(0, 0, 0, 0)

    const [
        { data: postsData },
        { data: projectsData },
        { data: commentsData }
    ] = await Promise.all([
        supabase.from('posts').select('created_at').gte('created_at', sixMonthsAgo.toISOString()),
        supabase.from('projects').select('created_at').gte('created_at', sixMonthsAgo.toISOString()),
        supabase.from('comments').select('created_at').gte('created_at', sixMonthsAgo.toISOString())
    ])

    // Generate Month array for last 6 months
    const activityMap: Record<string, { name: string; blogYazisi: number; yorum: number; proje: number; monthKey: string }> = {}
    const months = []
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const monthKey = `${d.getFullYear()}-${d.getMonth()}`
        const obj = {
            name: d.toLocaleString('tr-TR', { month: 'short' }),
            monthKey,
            blogYazisi: 0,
            yorum: 0,
            proje: 0
        }
        activityMap[monthKey] = obj
        months.push(obj)
    }

    // Generate Days array for last 7 days
    const visitorMap: Record<string, { name: string; yeniIcerik: number; yorum: number; dateString: string }> = {}
    const days = []
    for (let i = 6; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        const dateString = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
        const obj = {
            name: d.toLocaleString('tr-TR', { weekday: 'short' }),
            dateString,
            yeniIcerik: 0,
            yorum: 0
        }
        visitorMap[dateString] = obj
        days.push(obj)
    }

    // Process logic
    const processItem = (item: any, type: 'post' | 'project' | 'comment') => {
        if (!item.created_at) return
        const d = new Date(item.created_at)
        const monthKey = `${d.getFullYear()}-${d.getMonth()}`
        const dateString = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

        if (activityMap[monthKey]) {
            if (type === 'post') activityMap[monthKey].blogYazisi++
            if (type === 'project') activityMap[monthKey].proje++
            if (type === 'comment') activityMap[monthKey].yorum++
        }

        if (visitorMap[dateString]) {
            if (type === 'comment') visitorMap[dateString].yorum++
            else visitorMap[dateString].yeniIcerik++
        }
    }

    postsData?.forEach(i => processItem(i, 'post'))
    projectsData?.forEach(i => processItem(i, 'project'))
    commentsData?.forEach(i => processItem(i, 'comment'))

    const activityData = months.map(({ monthKey, ...rest }) => rest)
    const visitorData = days.map(({ dateString, ...rest }) => rest)

    return (
        <div className="space-y-6">
            <header className="mb-8">
                <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight">Dashboard</h2>
                <p className="text-slate-400 mt-1">Sisteminizin genel durum kontrolü</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Özet Kartları */}
                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <svg className="w-16 h-16 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
                    </div>
                    <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider relative z-10">Toplam Yazı</h3>
                    <p className="text-4xl font-extrabold text-slate-100 mt-2 relative z-10">{postCount || 0}</p>
                </div>

                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <svg className="w-16 h-16 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" /></svg>
                    </div>
                    <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider relative z-10">Portfolyo Projesi</h3>
                    <p className="text-4xl font-extrabold text-slate-100 mt-2 relative z-10">{projectCount || 0}</p>
                </div>
            </div>

            {/* Grafikler */}
            <DashboardCharts activityData={activityData} visitorData={visitorData} />
        </div>
    )
}
