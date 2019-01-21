using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.Models
{
    // BlockIO API Configuration Informations
    public static class BlockIODataSet
    {
        public static String api_key_btc = "4fe6-1079-3415-e9b9"; // test mode
        //public static String api_key_btc = "b3e9-73ec-8413-f402"; // real mode
        //public static String api_key_btctest = "4fe6-1079-3415-e9b9"; // for real life mode
        public static String api_key_btctest = "15fa-968b-cbfb-b108"; // for test-net mode
        public static String network_btc = "BTC";
        public static String network_btctest = "BTCTEST"; // for Transaction detail function
        public static String secret_pin = "alskdjfhg";

        // ==== server real data ====================================================================
        //public static String adminEmail = "Admin@m2-Mining.com";
        //public static String adminUserId = "c2b72c4b-01c0-4d0f-9506-968de0b6bb44";
        // ====================================================================================
        public static String CurrentUserID = "";
        // ================= for my local ===========================================================
         public static String adminEmail = "pandaworld1985@outlook.com";
         public static String adminUserId = "a123a9cb-fb2b-4a0f-a87f-af21d7f39294";

         public static String fee_collection_address = "2MyBdugTzpmfNWDQyLAfM9Stg8tT9jr2tmW"; // test mode
        // public static String fee_collection_address = "33gLocWwdJGRxxA4nHN1AfjPp2t7KnRQ42"; //  real mode (old)
        // public static String fee_collection_address = "3Kru7yabVsws6NLU7CfC7VM4LjeZPkcraX"; //  real mode (new 9/11/2018)
        public static String cryptoCurrency = "BTC";
        public static String baseCurrency = "USD";

        public static String contract_btc_daily = "0.00083613"; // btc price for 10000GH/s, dont change this.!!!
        public static String contract_btc_usd_rate = ""; //dont change this item(automatically calculated daily)!!!!

        //public static String[] contract_plan_usd = { "150","500", "1000", "2500", "600", "1200", "2400","500","1000" }; // update 29/8/2018
        public static String[] contract_plan_usd = {"150", "500", "1000", "2500", "2500", "600", "1200", "2400", "500", "1000" }; // update 29/8/2018

        //public static String[] contract_plan_hashrate = {"900", "3000", "7000", "20000", "50000", "110000", "250000","5000","10000" }; // update 29/8/2018
        public static String[] contract_plan_hashrate = {"0", "1.85", "3.7", "9.25", "20000", "50000", "110000", "250000", "5000", "10000" }; // update 29/8/2018
        public static String contract_plan_hashrate_unit = "USD/day"; // update 29/8/2018 "Gh/s"->"USD/day"

        public static String[] contract_plan_power = { "2000", "2000", "2600", "2800", "800", "1000", "1200","1000","2000" }; // watt
        public static String[] contract_plan_powercost = {"0.02", "0.02", "0.02", "0.02", "0.02", "0.02", "0.02", "0.02", "0.02" }; // usd/kwh
        public static String[] contract_plan_fee_rate = {"0.0", "0.0", "0.0", "0.1", "0.1", "0.1", "0.1", "0.1", "0.1" }; 
        public static String[] CoinwarzAlgo = { "sha-256","sha-256", "sha-256", "sha-256", "scrypt", "scrypt", "scrypt", "scrypt", "sha-256" };
        public static String[] CoinwarzAlgoPrefix = { "sha256", "sha256", "sha256", "sha256", "scrypt", "scrypt", "scrypt", "scrypt", "sha256" };
        public static int contract_pay_period = 1; // unit:date. ex: 1 -> pay per day, 3 -> pay per 3 days

        public static String SIMUL_MODE = "simul"; // Email verification working mode
        public static String REAL_MODE = "real";
        public static String EmailMode = SIMUL_MODE;

        public static String regularFee = "1.0"; // fee unit : 0.0001 BTC
        public static String priorityFee = "6.0";

        // dont change these address infos!!! -------------------------------------------------------------------------
        public static String BlockIORoot = "https://block.io";
        public static String getNewAddress = "/api/v2/get_new_address";
        public static String getMyAddresses = "/api/v2/get_my_addresses";
        public static String getCurrentExchangePrice = "/api/v2/get_current_price";
        public static String getTransactions = "/api/v2/get_transactions";
        public static String sendBTC = "/api/v2/withdraw_from_addresses";
        public static String getBlockIONetworkFee = "/api/v2/get_network_fee_estimate";

        public static String paymentRequest = "https://blockchain.info/payment_request"; // for Payment Request function
        public static String transactionConfirm = "https://chain.so/tx/"; // for Transaction detail function

        public static String CoinwarzRoot = "https://www.coinwarz.com"; // for Payout function
        public static String CoinwarzApiKey = "86da768c9a844f45ba81992a53d1379f";
        public static String getCoinwarzProfitability = "/v1/api/profitability";

        public static String BlockChainInfoRoot = "https://api.blockchain.info/charts"; // for BlockChain Mining Chart information
        public static String BlockChainInfoHashRate = "/charts/hash-rate?format=json";
        // ------------------------------------------------------------------------------------------------------------
    }

    public class BlockIoApiGet
    {
        public String status { get; set; }
        public BlockIoData data { get; set; }

    }

    public class TransactionReceived
    {
        public String recepient { get; set; }
        public String amount { get; set; }
    }

    public class JSONResultParsing
    {
        public String status { get; set; }
        public String data { get; set; }
    }

    public class BlockIoData
    {
        public String network { get; set; }
        public int user_id { get; set; }
        public String address { get; set; }
        public String label { get; set; }
        public String available_balance { get; set; }
        public String pending_received_balance { get; set; }
        public Boolean is_segwit { get; set; }

        public BlockIoAddressItem[] addresses { get; set; }
        public BlockIoAddressItem[] balances { get; set; }
        public BlockIoPriceItem[] prices { get; set; }
        public BlockIoTransactionItem[] txs { get; set; }

        public String error_message { get; set; }

        // Transaction part
        public String txid { get; set; }
        public String amount_withdrawn { get; set; }
        public String amount_sent { get; set; }
        public String network_fee { get; set; }
        public String blockio_fee { get; set; }

        // Network Fee part
        public String estimated_network_fee { get; set; }
    }

    public class BlockIoAddressItem
    {
        public String network { get; set; }
        public int user_id { get; set; }

        public String address { get; set; }
        public String label { get; set; }
        public String available_balance { get; set; }
        public String pending_received_balance { get; set; }
        public String is_segwit { get; set; }
    }


    public class BlockIoPriceItem
    {
        public String price { get; set; }
        public String price_base { get; set; }
        public String exchange { get; set; }
        public String time { get; set; }
    }

    public class BlockIoAmountItem
    {
        public String recipient { get; set; }
        public String amount { get; set; }
    }

    public class BlockIoTransactionItem
    {
        public String txid { get; set; }
        public Boolean from_green_address { get; set; }
        public String time { get; set; }
        public long confirmations { get; set; }
        public BlockIoAmountItem[] amounts_received { get; set; }
        public String[] senders { get; set; }
        public double confidence { get; set; }
        public String propagated_by_nodes { get; set; }

        public String total_amount_sent { get; set; }
        public BlockIoAmountItem[] amounts_sent { get; set; }
    }

    public class CoinWarzDataItem
    {
        public String CoinName { get; set; }
        public String CoinTag { get; set; }
        public String Algorithm { get; set; }
        public double Difficulty { get; set; }
        public float BlockReward { get; set; }
        public Int32 BlockCount { get; set; }
        public int ProfitRatio { get; set; }
        public int AvgProfitRatio { get; set; }
        public String Exchange { get; set; }
        public float ExchangeRate { get; set; }
        public double ExchangeVolume { get; set; }
        public Boolean IsBlockExplorerOnline { get; set; }
        public Boolean IsExchangeOnline { get; set; }
        public String Message { get; set; }
        public int BlockTimeInSeconds { get; set; }
        public String HealthStatus { get; set; }
    }

    public class CoinWarzApiGet
    {
        public Boolean Success { get; set; }
        public String Message { get; set; }
        public CoinWarzDataItem[] Data { get; set; }
    }

    public class BlockChainHashChart
    {
        public Boolean Success { get; set; }
        public String Message { get; set; }
        public CoinWarzDataItem[] Data { get; set; }
    }

    public class PointData
    {
        public double x { get; set; }
        public double y { get; set; }
    }

    public class BlockChainApiGet
    {
        public String status { get; set; }
        public String name { get; set; }
        public String unit { get; set; }
        public String period { get; set; }
        public String description { get; set; }
        public PointData[] values { get; set; }
    }

    public class ProfitHistoryData
    {
        public string date { get; set; }
        public decimal volume { get; set; }
    }
}