{
    "placeholders": [
        {
            "name": "[[totalprice]]",
            "scope": "item",
            "razor": "totalprice",
            "code": "var [[scope]]_totalpricedouble = 0.00; [[scope]]_totalpricedouble = @[[scope]].Price * @[[scope]].Quantity; var [[scope]]_totalprice = Math.Round([[scope]]_totalpricedouble, 2).ToString(\"0.00\");"
        },
        {
            "name": "[[webview]]",
            "scope": "none",
            "legacy": true
        },
        {
            "name": "[[unsubscribe]]",
            "scope": "none",
            "legacy": true
        },
        {
            "name": "[[customername]]",
            "scope": "session",
            "razor": "salutation",
            "code": "var [[scope]]_salutation = \"Customer\"; if(Model.Customer != null && string.IsNullOrEmpty(Model.Customer.FirstName) == false) { [[scope]]_salutation = String.Format(\"{0},\", Model.Customer.FirstName); }"
        },
        {
            "name": "[[totalvalue]]",
            "scope": "session",
            "code": "var [[scope]]_totalvaluedouble = 0.00; [[scope]]_totalvaluedouble = @Model.BasketValue; var [[scope]]_totalvalue = Math.Round([[scope]]_totalvaluedouble, 2).ToString(\"0.00\");", 
            "razor": "totalvalue"

        },
        {
            "name": "[[itemimage]]",
            "scope": "item",
            "razor": "imageurl", 
            "code": "var [[scope]]_imageurl = [[scope]].ImageUrl;",
            "prepend": { "id" : "imageReplaceUrl", "value" : "value" }

        },
        {
            "name": "[[itemname]]",
            "scope": "item",
            "razor": "productName", 
            "code": "var [[scope]]_productName = @[[scope]].Name;"

        },
         {
             "name": "[[itemvalue]]",
             "scope": "item",
             "razor": "price",
             "code": "var [[scope]]_pricedouble = 0.00; [[scope]]_pricedouble = @[[scope]].Price; var [[scope]]_price = Math.Round([[scope]]_pricedouble, 2).ToString(\"0.00\");"

         },
         {
             "name": "[[itemquantity]]",
             "scope": "item",
             "razor": "quantity", 
             "code": "var [[scope]]_quantity = [[scope]].Quantity;"

         },
          {
              "name": "[[itemquantity1]]",
              "scope": "item",
              "razor": "quantity1", 
              "code": "var [[scope]]_quantity1 = [[scope]].Quantity;"

          },
          {
              "name": "[[itemcurrency]]",
              "scope": "session",
              "razor": "cur",
              "code": "var [[scope]]_cur = @RenderCurrencySymbol();",
              "comment": "this is the apparent standard placeholder for currency, this still needs to be tested and clarified, if all fails, use session:cur and add it manually"
          },
          {
              "name": "[[currencysymbol]]",
              "scope": "session",
              "razor": "cur",
              "code": "var [[scope]]_cur = @RenderCurrencySymbol();",
              "comment": "this is the apparent standard placeholder for currency, this still needs to be tested and clarified, if all fails, use session:cur and add it manually"
          },
          {
              "name": "[[customfield1]]",
              "scope": "item",
              "razor": "customfield1",
              "code": "var [[scope]]_customfield1 = @TryGetItemField(@[[scope]], \"f1\");"

          },
           {
               "name": "[[numitems]]",
               "scope": "session", 
               "code": "var [[scope]]_numitems = String.Format(\"{0}\", Model.Products.Sum(p => p.Quantity));",
               "razor": "numitems"
           }, 
           {
               "name": "[[customeremail]]", 
               "scope": "session", 
               "code": "var [[scope]]_email = @Model.Customer.Email;",
               "razor": "email"
           }, 
           {
               "name": "[[itemid]]", 
               "scope": "item", 
               "code": "var [[scope]]_itemid = @[[scope]].ProductId;",
               "razor": "itemid"
           },
           {
               "name": "[[numberofadults]]", 
               "scope": "item", 
               "code": "var [[scope]]_na = @TryGetItemField(@[[scope]], \"na\");", 
               "razor": "na"
           },
            {
                "name": "[[numberofnights]]", 
                "scope": "item", 
                "code": "var [[scope]]_nn = @TryGetItemField(@[[scope]], \"nn\");", 
                "razor": "nn"
            },
             {
                 "name": "[[numberofchildren]]", 
                 "scope": "item", 
                 "code": "var [[scope]]_nc = @TryGetItemField(@[[scope]], \"nc\");", 
                 "razor": "nc"
             },
              {
                  "name": "[[numberofinfants]]", 
                  "scope": "item", 
                  "code": "var [[scope]]_ni = @TryGetItemField(@[[scope]], \"ni\");", 
                  "razor": "ni"
              }


    ]
}