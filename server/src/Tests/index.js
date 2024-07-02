let discountUsersUsed = ["1", "1", "2"];
let auth = "1";

let discountUserUse = discountUsersUsed.reduce(
  (count, user) => (user === auth ? ++count : count),
  0
);

console.log(discountUserUse); // Output: 2
