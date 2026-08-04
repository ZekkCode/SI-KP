import MahasiswaLayout from '@/Layouts/MahasiswaLayout';
import { useForm, Link } from '@inertiajs/react';
import React from 'react';
import { FileText, Upload, Download, CheckCircle2 } from 'lucide-react';

interface SuratBalasanData {
    nomor_surat: string;
    tanggal_surat: string;
    path_file: string;
}

interface Pendaftaran {
    id: number;
    status: string;
    surat_balasan: SuratBalasanData | null;
}

interface Props {
    pendaftaran: Pendaftaran | null;
}

export default function SuratBalasan({ pendaftaran }: Props) {

    const form = useForm({
        nomor_surat: '',
        tanggal_surat: '',
        file: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        form.post('/mahasiswa/surat-balasan');
    };

    return (
        <div className="flex-1 p-6 max-w-4xl mx-auto space-y-6">

            <div>
                <h1 className="text-3xl font-bold">
                    Surat Balasan Instansi
                </h1>

                <p className="text-gray-500 mt-2">
                    Upload surat balasan dari instansi tempat Kerja Praktik.
                </p>
            </div>

            {pendaftaran?.surat_balasan ? (

                <div className="bg-green-50 border border-green-300 rounded-xl p-6">

                    <div className="flex items-center gap-3">

                        <CheckCircle2 className="text-green-600"/>

                        <div>

                            <h3 className="font-semibold">
                                Surat Balasan Sudah Diupload
                            </h3>

                            <p>
                                Nomor Surat :
                                {" "}
                                {pendaftaran.surat_balasan.nomor_surat}
                            </p>

                        </div>

                    </div>

                    <a
                        href="/mahasiswa/surat-balasan/download"
                        className="mt-5 inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg"
                    >
                        <Download size={18}/>
                        Download Surat
                    </a>

                </div>

            ) : (

                <form
                    onSubmit={submit}
                    className="bg-white rounded-xl border p-6 space-y-5"
                >

                    <div>

                        <label className="font-medium">
                            Nomor Surat
                        </label>

                        <input
                            className="w-full border rounded-lg mt-2 p-2"
                            value={form.data.nomor_surat}
                            onChange={(e)=>
                                form.setData(
                                    'nomor_surat',
                                    e.target.value
                                )
                            }
                        />

                    </div>

                    <div>

                        <label className="font-medium">
                            Tanggal Surat
                        </label>

                        <input
                            type="date"
                            className="w-full border rounded-lg mt-2 p-2"
                            value={form.data.tanggal_surat}
                            onChange={(e)=>
                                form.setData(
                                    'tanggal_surat',
                                    e.target.value
                                )
                            }
                        />

                    </div>

                    <div>

                        <label className="font-medium">
                            Upload PDF
                        </label>

                        <input
                            type="file"
                            accept=".pdf"
                            className="mt-2"
                            onChange={(e)=>
                                form.setData(
                                    'file',
                                    e.target.files
                                        ? e.target.files[0]
                                        : null
                                )
                            }
                        />

                    </div>

                    <button
                        className="bg-primary text-white px-5 py-2 rounded-lg"
                    >
                        Upload Surat Balasan
                    </button>

                </form>

            )}

        </div>
    );
}

SuratBalasan.layout = (page: React.ReactNode) => (
    <MahasiswaLayout>
        {page}
    </MahasiswaLayout>
);