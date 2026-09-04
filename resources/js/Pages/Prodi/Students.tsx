import { useState } from 'react';
import ProdiLayout from '@/Layouts/ProdiLayout';
import { Search, Printer, Users, CheckCircle, Clock } from 'lucide-react';
import PageHeader from '@/Components/PageHeader';
import ModernTable, { ModernTableHeader, ModernTableTh, ModernTableBody, ModernTableTd } from '@/Components/ModernTable';

interface Student {
  no: number;
  nim: string;
  mahasiswa: {
    name: string;
  };
  semester: string;
  status: 'Sedang KP' | 'Selesai KP' | 'Tidak KP / Belum KP';
  status_asli: 'sedang_kp' | 'selesai' | 'belum_kp';
}

interface Props {
  initialStudents: Student[];
}

const generateSemesterOptions = () => {
  const currentYear = new Date().getFullYear();
  return [
    { value: '', label: 'Semua Semester' },
    { value: `Ganjil ${currentYear}/${currentYear + 1}`, label: `Ganjil ${currentYear}/${currentYear + 1}` },
    { value: `Genap ${currentYear}/${currentYear + 1}`, label: `Genap ${currentYear}/${currentYear + 1}` },
    { value: `Ganjil ${currentYear + 1}/${currentYear + 2}`, label: `Ganjil ${currentYear + 1}/${currentYear + 2}` },
    { value: `Genap ${currentYear + 1}/${currentYear + 2}`, label: `Genap ${currentYear + 1}/${currentYear + 2}` }
  ];
};

export default function Students({ initialStudents = [] }: Props) {
  const [selectedSemester, setSelectedSemester] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const semesterOptions = generateSemesterOptions();

  // Filter students based on search and semester
  const filteredStudents = students.filter(student => {
    const matchesSemester = selectedSemester ? student.semester === selectedSemester : true;
    const nameToMatch = student.mahasiswa?.name || '';
    const matchesSearch = nameToMatch.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.nim.includes(searchTerm);
    return matchesSemester && matchesSearch;
  });

  const countSedangKP = students.filter(s => s.status === 'Sedang KP').length;
  const countSelesaiKP = students.filter(s => s.status === 'Selesai KP').length;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="animate-in fade-in duration-300 p-4 md:p-8">
      {/* Header */}
      <PageHeader title="Daftar Mahasiswa" description="Daftar mahasiswa yang sedang atau telah selesai melaksanakan Kerja Praktek." />

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
      <div id="daftar-mahasiswa" className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden mt-8">
        {/* Filters and Action Buttons */}
        <div className="p-4 border-b border-outline-variant bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-1 w-full gap-3 items-center">
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="bg-white border border-outline-variant text-on-surface text-sm rounded-lg focus:ring-primary focus:border-primary block p-2 w-full sm:max-w-xs focus:outline-none"
            >
              {semesterOptions.map((opt, idx) => (
                <option key={idx} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <div className="relative flex-1 max-w-sm hidden sm:block">
              <input
                type="text"
                placeholder="Cari NIM atau Nama..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white border border-outline-variant text-on-surface text-sm rounded-lg focus:ring-primary focus:border-primary block w-full pl-10 pr-4 py-2 focus:outline-none transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
            </div>
          </div>

          <div className="flex w-full sm:w-auto gap-2 justify-end">
            <button 
              onClick={handlePrint}
              className="bg-primary hover:bg-primary/90 text-white font-medium rounded-lg text-sm px-4 py-2 flex items-center justify-center gap-2 shadow-sm transition-colors active:scale-95"
              title="Cetak Laporan"
            >
              <Printer size={18} /> Cetak
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <ModernTable>
            <ModernTableHeader>
              <tr>
                <ModernTableTh>No</ModernTableTh>
                <ModernTableTh>NIM</ModernTableTh>
                <ModernTableTh>Nama Mahasiswa</ModernTableTh>
                <ModernTableTh>Semester</ModernTableTh>
                <ModernTableTh>Status</ModernTableTh>
              </tr>
            </ModernTableHeader>
            <ModernTableBody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, index) => (
                  <tr key={student.nim} className="border-b border-outline-variant hover:bg-surface-container-lowest transition-colors">
                    <ModernTableTd>{index + 1}</ModernTableTd>
                    <ModernTableTd>{student.nim}</ModernTableTd>
                    <ModernTableTd>{student.mahasiswa?.name ?? 'Nama Tidak Ditemukan'}</ModernTableTd>
                    <ModernTableTd>{student.semester}</ModernTableTd>
                    <ModernTableTd>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        student.status_asli === 'selesai' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : student.status_asli === 'sedang_kp'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-surface-variant text-on-surface-variant'
                      }`}>
                        {student.status}
                      </span>
                    </ModernTableTd>
                  </tr>
                ))
              ) : (
                <tr>
                  <ModernTableTd>
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-outline">
                        <Users size={24} />
                      </div>
                      <p>Tidak ada data mahasiswa untuk filter ini.</p>
                    </div>
                  </ModernTableTd>
                </tr>
              )}
            </ModernTableBody>
          </ModernTable>
        </div>
      </div>
    </div>
  );
}

Students.layout = (page: React.ReactNode) => <ProdiLayout>{page}</ProdiLayout>;
