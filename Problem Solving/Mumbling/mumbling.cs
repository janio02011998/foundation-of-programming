using System;
using System.Collections.Generic;

public class Accumul 
{
    public static string Accum(string s) 
    {
        // Initialize a list to hold the result substrings
        List<string> mumbling = new List<string>();

        // Iterate through each character in the input string
        for (int i = 0; i < s.Length; i++) 
        {
            // Get the character at the current position
            char c = s[i];
            
            // Build the substring for the current character
            string sub = c.ToString().ToUpper() + new string(char.ToLower(c), i);
            
            // Add the built substring to the list
            mumbling.Add(sub);
        }
        
        // Join all substrings with '-' and return the result
        return string.Join("-", mumbling);
    }
}
