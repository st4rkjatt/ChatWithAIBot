
const Dp = ({ name }: { name: string}) => {
    // name like ajeet kumar
    const getInitials = (fullName: string) => {
        // console.log(fullName)
        
        const parts = fullName?.trim()?.split(" ")
  
        if (parts.length === 1) return parts[0][0]?.toUpperCase() || '';
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };
    const initials = getInitials(name);
    return <div className="w-12 h-12 shadow-5 rounded-full border border-blue-600 flex justify-center items-center">
        <div className='font-bold text-lg'>{initials}</div>
    </div>
};

export default Dp;