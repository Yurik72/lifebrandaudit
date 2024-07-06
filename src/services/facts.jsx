import * as React from "react";

import axios from "axios";
import { QueryClient, skipToken, useQuery, useQueryClient } from "react-query";


function useFacts() {
  return useQuery({
    queryKey: ["facts"],
    queryFn: async () => {
      const { data } = await axios.get(
        "https://uselessfacts.jsph.pl/random.json",
      );
      console.log("call facts");
      return data;
    },
  });
}

export { useFacts };
