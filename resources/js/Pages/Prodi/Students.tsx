import { useState } from 'react';
import ProdiLayout from '@/Layouts/ProdiLayout';
import { Search, Printer, Users, CheckCircle, Clock } from 'lucide-react';

interface Student {
  no: number;
  nim: string;
  name: string;
  semester: string;
  status: 'Sedang KP' | 'Selesai KP';
}

const INITIAL_STUDENTS: Student[] = [
  { no: 1, nim: '20041110001', name: 'Budi Santoso', semester: 'Genap 2022/2023', status: 'Sedang KP' },
  { no: 2, nim: '20041110002', name: 'Siti Aminah', semester: 'Genap 2022/2023', status: 'Selesai KP' },
  { no: 3, nim: '20041110003', name: 'Ahmad Dahlan', semester: 'Genap 2022/2023', status: 'Sedang KP' },
  { no: 4, nim: '20041110004', name: 'Diana Fitri', semester: 'Genap 2022/2023', status: 'Selesai KP' },
  { no: 5, nim: '20041110005', name: 'Eko Prabowo', semester: 'Genap 2022/2023', status: 'Sedang KP' },
  { no: 6, nim: '20041110012', name: 'Rian Hidayat', semester: 'Ganjil 2023/2024', status: 'Sedang KP' },
  { no: 7, nim: '20041110015', name: 'Indah Lestari', semester: 'Ganjil 2023/2024', status: 'Selesai KP' },
];

export default function Students() {
  const [selectedSemester, setSelectedSemester] = useState('Genap 2022/2023');
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);

  // Filter students based on search and semester
  const filteredStudents = students.filter(student => {
    const matchesSemester = selectedSemester ? student.semester === selectedSemester : true;
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.nim.includes(searchTerm);
    return matchesSemester && matchesSearch;
  });

  const countSedangKP = students.filter(s => s.status === 'Sedang KP').length;
  const countSelesaiKP = students.filter(s => s.status === 'Selesai KP').length;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 md:p-8 max-w-[1200px] mx-auto space-y-8 bg-[#f4f6f9] min-h-screen">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
          KERJA PRAKTEK TEKNIK INFORMATIKA UTM
        </p>
        <h1 className="text-3xl font-bold text-[#002f6c] mt-1">
          Mahasiswa Kerja Praktek
        </h1>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Card: Mahasiswa Sedang KP */}
        <div className="bg-white rounded-xl border border-outline-variant shadow-sm p-6 flex flex-col justify-between h-[240px] relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-5xl font-extrabold text-blue-600">{countSedangKP}</span>
              <p className="text-sm font-medium text-slate-500 mt-2">Mahasiswa aktif melakukan kerja praktek</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Clock size={24} />
            </div>
          </div>
          <div className="mt-auto">
            <a href="#daftar-mahasiswa" className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-1">
              Mahasiswa Sedang KP
            </a>
          </div>
        </div>

        {/* Right Card: Mahasiswa Selesai KP */}
        <div className="bg-white rounded-xl border border-outline-variant shadow-sm p-6 flex flex-col justify-between h-[240px] relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute right-4 top-4 bottom-14 left-1/3 flex items-center justify-end z-0">
            <img 
              src="/images/graduates.png" 
              alt="Graduates" 
              className="h-full object-contain pointer-events-none group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="z-10 flex justify-between items-start">
            <div>
              <span className="text-5xl font-extrabold text-green-600">{countSelesaiKP}</span>
              <p className="text-sm font-medium text-slate-500 mt-2">Mahasiswa telah menyelesaikan kerja praktek</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
              <CheckCircle size={24} />
            </div>
          </div>
          <div className="mt-auto z-10">
            <a href="#daftar-mahasiswa" className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-1">
              Mahasiswa Selesai KP
            </a>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div id="daftar-mahasiswa" className="bg-white rounded-xl border border-outline-variant shadow-sm p-6 space-y-6">
        <h2 className="text-xl font-semibold text-center text-slate-700">
          Daftar Mahasiswa Kerja Praktek 2026
        </h2>

        {/* Filters and Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50 p-4 rounded-lg">
          <div className="flex flex-1 w-full gap-3 items-center">
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="bg-white border border-slate-300 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 w-full sm:max-w-xs focus:outline-none"
            >
              <option value="Genap 2022/2023">Genap 2022/2023</option>
              <option value="Ganjil 2023/2024">Ganjil 2023/2024</option>
            </select>

            <div className="relative flex-1 max-w-sm hidden sm:block">
              <input
                type="text"
                placeholder="Cari NIM atau Nama..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white border border-slate-300 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 pr-10 py-2.5 focus:outline-none"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            </div>
          </div>

          <div className="flex w-full sm:w-auto gap-2 justify-end">
            <button 
              className="bg-[#0091d5] hover:bg-sky-600 text-white font-medium rounded-lg text-sm px-4 py-2.5 flex items-center justify-center gap-2 shadow-sm transition-colors w-12 h-10 sm:w-auto"
              title="Cari"
            >
              <Search size={18} />
            </button>
            <button 
              onClick={handlePrint}
              className="bg-[#f59e0b] hover:bg-amber-600 text-white font-medium rounded-lg text-sm px-4 py-2.5 flex items-center justify-center gap-2 shadow-sm transition-colors w-12 h-10 sm:w-auto"
              title="Cetak Laporan"
            >
              <Printer size={18} />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-sm text-left text-slate-500 border-collapse">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 text-center font-bold">No.</th>
                <th className="py-3 px-4 font-bold">NIM</th>
                <th className="py-3 px-4 font-bold">Nama Mahasiswa</th>
                <th className="py-3 px-4 font-bold">Semester</th>
                <th className="py-3 px-4 text-center font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, index) => (
                  <tr key={student.nim} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 text-center font-medium text-slate-900">{index + 1}</td>
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-900">{student.nim}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-900">{student.name}</td>
                    <td className="py-3.5 px-4">{student.semester}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        student.status === 'Selesai KP' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {student.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    Tidak ada data mahasiswa untuk filter ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

Students.layout = (page: React.ReactNode) => <ProdiLayout>{page}</ProdiLayout>;
