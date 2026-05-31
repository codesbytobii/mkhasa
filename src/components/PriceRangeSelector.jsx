export const PriceRangeSelector = () => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-black">Price</h2> <button>Apply</button>
        <div className="flex justify-between items-center">
          <p>$0</p>
          <p>$10,000</p>
        </div>
      </div>
    </div>
  );
};
