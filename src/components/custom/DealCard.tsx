import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronDown } from 'lucide-react';
import { Progress } from '../ui/progress';
import { DealCard } from '@/constants/dealsConstant';

// {
//       "deal_id": "05df72d4-6c0a-4eaa-a8a9-a7fdb7cee2c2",
//       "description": "dscvsd f. df ddfc ",
//       "title": "hjhghjk",
//       "deal_status": "open",
//       "current_valuation": 234545,
//       "round_size": 78789889,
//       "commitment": 888788,
//       "business_model": "transactional",
//       "company_stage": "series-b",
//       "logo_url": "https://fundos-dev-bucket.s3.amazonaws.com/deals/logos/05df72d4-6c0a-4eaa-a8a9-a7fdb7cee2c2_20250531094813.svg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIA5Y64M7HMW7LL355H%2F20250531%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250531T094813Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmFwLXNvdXRoLTEiRjBEAiBFM68qjRhhpfMHyn0EjsOnOxcahwRpifHBF5mmrf0ydAIgGRLmVlWa3x3na%2FenXhYqikIXeYIj4kttY5Nc0x81eQgqxwUIu%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw5NDY5NjU2NDE2ODkiDIzqW5luj38fQG1QPyqbBTkOpKMISXGFgz3ct9uavEmZ%2Fij6pKg6as3H53Yo75iFYFoVByPNCk0lkusyvzTvkEg8IXmLJxTsRHQv5fvAAHL8xqa1wrsFs%2Fa7m%2F%2F50rXx6ob106etPNaiCoNf6eDHr3ypQjHVqCnXiKBRBqgvXRdA7GROg%2FfQbpaI3ZPcoj3yurIx8w0ggsTvOdqT67C8nbC9yStj5a%2Flhqy9mESzg3kjqfkDuXJy%2BUvLFw1Bmw3UgKpfA1Pteu2MrwO0vy15zEzGwQggGAR3C8ozZd91OdG1bcDktCXx0ErAfMfem29Jf%2FQ%2F8N7ucBRHFBXjvRav%2FHUIeH1N5DjEun9MlD1GKiTx8vk%2FehfAvpJ9QRM3D4yc7WdkVe%2FFsog9OX1%2F%2FABF6Kv3QYdbN4bQEe2iatJ%2Bv8MLjvKDclGEVK%2FzxCEYRswoS5%2FLYcCAqJavgrvafNiwMej5RdzOX6IZ7I7DufUnehsFnOVMKcovVBZRFyflwf%2BVmU7HQS%2FGEgrD5JVe72CHAa7iE%2FXYhMP0L8%2FuTMBn8qS4cOTgiliztYPfEVeb8BeWE0ed6vlLQw%2B8enqLwYt5eoGiDFiGKl7nj%2BwbxNP97HJ24VH2nFmszTI4VI9vioi4BSoEHgW4dk7iLto8nz4QX0kPgUqe0uB2Y2CwQdv0AKoNof34z70ALggbKciphyimqsPCFL5oP8Zn%2B8a9vTZRQao7rEIJmSTI3n4A7KRZQeyWBIgSUlhiepSN16bhcabET75Btf4obkfu%2F%2BEsYhc24Mvtk9ZbAOnexy2n9uRSkKM1b%2FKKm5d07PUFQt4ER0b43%2BKTpjnNylIRYveabUlOCKYUYRAubbUCls3a8xEnXUeg4xGrfS4Iedkh03nc%2Bhz6yL6wE5%2FIvHdC48Mwt5nrwQY6sgGdTuIQ3VTUPNgA3w7iWbFoOYIBFxeZONwD5nG8GLx1xp38T9m20x7kugow0M8Ad763plzSNAAVsXd4L3ptVFWHpj56pHxNKmzxkNvK49va8eu5Bjg6Fkolr8ActE31CGchRLoJ16%2FfDT0KTZvI3TDukffnBLCwYLNmr4lGvfJErYz6qdqjkvjBavFY%2FO3f0BCyofTjAyf8iXeNBqxKj4CLAfX03eMlS0OyO3Ful7qYYM%2FH&X-Amz-Signature=9a1b8c42588700019c38a98b7c8b0539a5159c9b8d0ac3aa4049b10d9a5d0b23",
//       "created_at": "2025-05-31T08:16:04.304173"
//     },

export default function CardDeal({ deal }: { deal: DealCard }) {
  const {
    title,
    deal_status,
    round_size,
    created_at,
    // logo_url,
    description,
    commitment,
    business_model,
    company_stage,
  } = deal;
  return (
    <Card className="border-0 rounded-none bg-[#1a1a1a] text-white p-5 w-[413px] max-w-md">
      <CardContent className="p-0">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            {/* <img src="./fundos.svg" alt="logo" width="50" /> : */}
            <div className="bg-violet-200 text-violet-800 px-3 py-4 rounded-xs font-medium text-sm">
              🚀 Startup
            </div>
          </div>

          <div className="flex flex-col items-end">
            {deal_status !== 'closed' ? (
              <Badge className="bg-[#00fb5745] text-white px-3 py-1 rounded-xs text-sm font-medium">
                <span className="mr-1 inline-block w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-green-400">active</span>
              </Badge>
            ) : (
              <Badge className="bg-[#fd888845] text-white px-3 py-1 rounded-xs text-sm font-medium">
                <span className="mr-1 inline-block w-2 h-2 bg-red-400 rounded-full" />
                <span className="text-red-400">closed</span>
              </Badge>
            )}
            <p className="text-xs text-zinc-400 mt-1">
              <span className="font-medium">Created on:</span>
              <span className="ml-1">
                {created_at ? created_at.split('T')[0] : 'N/A'}
              </span>
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-4">
          {title ? title : 'Default Deal Title'}
        </h2>
        <p className="text-zinc-400 mt-1">
          {description
            ? description
            : 'Default description for the deal. This is a placeholder text.'}
        </p>

        <div className="flex gap-2 mt-3">
          <span className="bg-zinc-800 text-white px-3 py-1 rounded-xs text-sm">
            {business_model ? business_model : 'Default Model'}
          </span>
          <span className="bg-zinc-800 text-white px-3 py-1 rounded-xs text-sm">
            {company_stage ? company_stage : 'Default Stage'}
          </span>
        </div>

        <div className="flex justify-between mt-6">
          <div>
            <p className="text-sm text-zinc-400">Funding round size</p>
            <p className="text-3xl font-bold">
              {round_size ? round_size : '0'}
            </p>
          </div>
          <div>
            <p className="text-sm text-zinc-400">Capital committed</p>
            <p className="text-3xl font-bold">
              {commitment ? commitment : '0'}
            </p>
          </div>
          {/* <div>
            <p className="text-sm text-zinc-400">Created At</p>
            <p className="text-3xl font-bold">{created_at.split('T')[0]}</p>
          </div> */}
        </div>
        <hr className="mt-3" />
        <div className="w-full mt-4 flex justify-between items-center">
          <div>
            <p className="text-sm text-zinc-400 mb-1">10% raised</p>
            <Progress className="bg-white" value={33} />
          </div>
          <div className="flex justify-end items-center text-white font-medium text-lg cursor-pointer">
            Manage <ChevronDown className="ml-1 h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
