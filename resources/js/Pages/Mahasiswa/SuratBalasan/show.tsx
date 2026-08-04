import MahasiswaLayout from "@/Layouts/MahasiswaLayout";

interface Props{
    pendaftaran:any;
}

export default function Show({pendaftaran}:Props){

    return(

        <div className="max-w-4xl mx-auto p-6">

            <h1 className="text-3xl font-bold mb-6">

                Detail Surat Balasan

            </h1>

            {!pendaftaran &&

                <div>

                    Tidak ada data.

                </div>

            }

            {pendaftaran &&

                <div className="bg-white rounded-xl shadow p-6 space-y-3">

                    <div>

                        <b>Status :</b>

                        {pendaftaran.status}

                    </div>

                    <div>

                        <b>Instansi :</b>

                        {pendaftaran.instansi?.nama}

                    </div>

                    <div>

                        <b>Alamat :</b>

                        {pendaftaran.instansi?.alamat}

                    </div>

                    <div>

                        <b>Tanggal Mulai :</b>

                        {pendaftaran.tanggal_mulai}

                    </div>

                    <div>

                        <b>Tanggal Selesai :</b>

                        {pendaftaran.tanggal_selesai}

                    </div>

                </div>

            }

        </div>

    )

}

Show.layout=(page:any)=><MahasiswaLayout>{page}</MahasiswaLayout>