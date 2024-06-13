using System;
using System.Linq;

public static class Kata
{
  public static string greet()
  {
    string[] hello ={
    
                     "hhh   hhh  eeeeeeeee  lll        lll             ooo",        
                     "hhh   hhh  eeeeeeeee  lll        lll          ooo   ooo",    
                     "hhh   hhh  eee        lll        lll         ooo     ooo",    
                     "hhhhhhhhh  eeeeee     lll        lll        ooo       ooo", 
                     "hhhhhhhhh  eeeeee     lll        lll        ooo       ooo", 
                     "hhh   hhh  eee        lll        lll         ooo     ooo",    
                     "hhh   hhh  eeeeeeeee  lllllllll  lllllllll    ooo   ooo",    
                     "hhh   hhh  eeeeeeeee  lllllllll  lllllllll       ooo",      
                     
          "ww            w             w      ooo       rrrrrrrr     lll        dddddddd",         
           "ww           ww           w    ooo   ooo    rrr   rrr    lll        dddddddddd",       
            "ww         w ww         w    ooo     ooo   rrr    rrr   lll        ddd     ddd",     
             "ww       w   ww       w    ooo       ooo  rrr   rrr    lll        ddd      ddd",   
              "ww     w     ww     w     ooo       ooo  rrrrrrr      lll        ddd      ddd",  
               "ww   w       ww   w       ooo     ooo   rrr   rrr    lll        ddd     ddd",    
                "ww w         ww w         ooo   ooo    rrr    rrr   lllllllll  dddddddddd ",    
                 "ww           ww             ooo       rrr     rrr  lllllllll  dddddddd "};
    
    string resString = String.Join("", String.Concat(hello).Replace(" ", "").GroupBy(x => x).Select(x => x.Key));
    return String.Concat(resString[0], resString[1], resString[2], resString[2], resString[3], " ", resString[4], resString[3], resString[5], resString[2], resString[6],"!");
  }
}