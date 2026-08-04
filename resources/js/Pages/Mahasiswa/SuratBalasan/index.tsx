import MahasiswaLayout from "@/Layouts/MahasiswaLayout";
import { Link } from "@inertiajs/react";

interface Props{
    pendaftaran:any;
}

export default function Index({pendaftaran}:Props){

    return(
        <div className="max-w-4xl mx-auto p-6">

            <h1 className="text-3xl font-bold">
                Surat Balasan Instansi
            </h1>

            {pendaftaran && (
                <div className="bg-white rounded-xl shadow mt-6 p-6 mb-6">
                
                    <h2 className="text-lg font-semibold mb-3">
                        Status Surat Balasan
                    </h2>

                    <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            pendaftaran.status === "diterima_instansi"
                                ? "bg-green-100 text-green-700"
                                : pendaftaran.status === "verifikasi_tu"
                                ? "bg-yellow-100 text-yellow-700"
                                : pendaftaran.status === "perlu_perbaikan"
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-700"
                        }`}
                    >
                        {pendaftaran.status.replaceAll("_"," ")}
                    </span>
                    
                </div>
            )}

            <div className="bg-white rounded-xl shadow mt-6 p-6">

                {!pendaftaran &&

                    <div>

                        Belum ada data pengajuan.

                    </div>

                }

                {pendaftaran &&

                    <>

                        <table className="table-auto">

                            <tbody>

                                <tr>

                                    <td>Status</td>

                                    <td>{pendaftaran.status}</td>

                                </tr>

                                <tr>

                                    <td>Instansi</td>

                                    <td>

                                        {pendaftaran.instansi?.nama}

                                    </td>

                                </tr>

                            </tbody>

                        </table>

                        {pendaftaran.catatan_tu && (

                            <div className="mt-5 rounded-lg border border-red-300 bg-red-50 p-4">
                            
                                <h3 className="font-semibold text-red-700">
                                    Catatan Tata Usaha
                                </h3>

                                <p className="mt-2 text-red-600">
                                    {pendaftaran.catatan_tu}
                                </p>

                            </div>

                        )}

                        {pendaftaran.status === "diterima_instansi" ? (

                            <div className="mt-6 rounded-lg bg-green-50 border border-green-200 p-4">
                            
                                <h3 className="font-semibold text-green-700">
                                    Surat Balasan Sudah Diverifikasi
                                </h3>
                                                
                                <p className="text-green-600 mt-2">
                                    Silakan menunggu penetapan dosen pembimbing.
                                </p>
                                                
                            </div>
                        
                        ) : (
                        
                            <Link
                                href="/mahasiswa/surat-balasan/detail"
                                className="mt-5 inline-block bg-blue-600 text-white px-4 py-2 rounded"
                            >
                                Lihat Detail
                            </Link>
                        
                        )}

                    </>

                }

            </div>

        </div>
    )

}

Index.layout=(page:any)=><MahasiswaLayout>{page}</MahasiswaLayout>