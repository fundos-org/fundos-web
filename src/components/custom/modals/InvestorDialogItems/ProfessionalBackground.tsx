import { ProfessionalBackground as PBType } from '@/constants/membersConstant';

const ProfessionalBackground: React.FC<{ data: PBType }> = ({ data }) => {
  console.log(data);
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Test 1 Component</h2>
      <p className="text-gray-700">
        This is the Test 1 component. It contains sample content for the first
        tab. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
        eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </p>
    </div>
  );
};

export default ProfessionalBackground;
