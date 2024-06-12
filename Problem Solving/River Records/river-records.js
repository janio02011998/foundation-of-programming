function maxDiff(arr)
{     
  let arr_size = arr.length;
  let max_diff = arr[1] - arr[0];
  for (let i = 0; i < arr_size; i++)
  {
    for (let j = i+1; j < arr_size; j++)
    {     
      if (arr[j] - arr[i] > max_diff) 
        max_diff = arr[j] - arr[i];
    } 
  }         
  return max_diff;
} 
console.log(maxDiff([5, 9, 1, 8, 2])); // output: 7
