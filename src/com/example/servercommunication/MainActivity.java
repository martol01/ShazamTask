package com.example.servercommunication;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Locale;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.json.JSONArray;
import org.json.JSONException;

import android.app.Activity;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

public class MainActivity extends Activity implements OnClickListener{

	EditText etRequest;
	TextView tvIsConnected, tvResponse;
	Button btSearch;
	Date lastDate=null;
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.get_request);

		// get reference to the views
		etRequest = (EditText) findViewById(R.id.etRequest);
		tvIsConnected = (TextView) findViewById(R.id.tvIsConnected);
		tvResponse =(TextView) findViewById(R.id.tvResponse);
		btSearch=(Button) findViewById(R.id.btSearch);
		btSearch.setOnClickListener(this);
		// check if you are connected or not
		if(isConnected()){
			tvIsConnected.setBackgroundColor(0xFF00CC00);
			tvIsConnected.setText("You are conncted");
        }
		else{
			tvIsConnected.setText("You are NOT conncted");
		}
	}

	public static String GET(String url){
		InputStream inputStream = null;
		String result = "";
		try {

			// create HttpClient
			HttpClient httpclient = new DefaultHttpClient();

			// make GET request to the given URL
			HttpResponse httpResponse = httpclient.execute(new HttpGet(url));

			// receive response as inputStream
			inputStream = httpResponse.getEntity().getContent();

			// convert inputstream to string
			if(inputStream != null)
				result = convertInputStreamToString(inputStream);
			else
				result = "Did not work!";

		} catch (Exception e) {
			Log.d("InputStream", e.getLocalizedMessage());
		}

		return result;
	}

    private static String convertInputStreamToString(InputStream inputStream) throws IOException{
        BufferedReader bufferedReader = new BufferedReader( new InputStreamReader(inputStream));
        String line = "";
        String result = "";
        while((line = bufferedReader.readLine()) != null)
            result += line;
        
        inputStream.close();
        return result;
        
    }
    public String ignoreCase(String input)
    {
    	String firstLetter=input.substring(0,1);
    	String rest=input.substring(1, input.length());
    	String result=firstLetter.toUpperCase()+rest.toLowerCase();
    	return result;
    }
    public boolean isConnected(){
    	ConnectivityManager connMgr = (ConnectivityManager) getSystemService(Activity.CONNECTIVITY_SERVICE);
    	    NetworkInfo networkInfo = connMgr.getActiveNetworkInfo();
    	    if (networkInfo != null && networkInfo.isConnected()) 
    	    	return true;
    	    else
    	    	return false;	
    }
    public Date convertToDate(String date) throws ParseException
    {
    	SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.UK);
		return sdf.parse(date);
    }
    private class HttpAsyncTask extends AsyncTask<String, Void, String> {
        @Override
        protected String doInBackground(String... urls) {
              
            return GET(urls[0]);
        }
        // onPostExecute displays the results of the AsyncTask.
        @Override
        protected void onPostExecute(String result) {
        	int limit = 10; 
        	ArrayList<String> songTitles=new ArrayList<String>();
        	Toast.makeText(getBaseContext(), "Received!", Toast.LENGTH_LONG).show();
        	try {
				JSONArray songs = new JSONArray(result);
				if(limit>songs.length())
					limit=songs.length();
				Log.d("DEBUG", "Here"+songs.length());
				StringBuilder response=new StringBuilder();
				response.append("Number of songs found " + songs.length());
				response.append(System.getProperty("line.separator"));
				for(int i=0;i<limit;i++)
				{
					if(lastDate==null)
					{
						response.append(songs.getJSONObject(i).get("title").toString());
						response.append(System.getProperty("line.separator"));
						songTitles.add(songs.getJSONObject(i).get("title").toString());
					}
					else
					{	
						String currentDate=(String) songs.getJSONObject(i).get("date").toString();
						if(lastDate.compareTo(convertToDate(currentDate))<0)
						{
							response.append(songs.getJSONObject(i).get("title").toString());
							response.append(System.getProperty("line.separator"));
							songTitles.add(songs.getJSONObject(i).get("title").toString());
						}
					}					
				}
				String latestDate = (String) songs.getJSONObject(limit-1).get("date").toString();
				lastDate = convertToDate(latestDate);
				Log.d("DEBUG","LATEST "+lastDate.toString());
				Log.d("DEBUG","LAST DATE IS "+lastDate.toString());
				tvResponse.setText(response);
				

			} catch (JSONException e) {
				tvResponse.setText("No results for this artist.");
				Log.d("DEBUG","FAILED PARSING");
				e.printStackTrace();
			} catch (ParseException e) {
				e.printStackTrace();
			}
       }
    }
	@Override
	public void onClick(View v) {
		switch(v.getId())
		{
		case R.id.btSearch:
			String artist=etRequest.getText().toString();
			artist=ignoreCase(artist);
			String requestUrl="http://zasham.herokuapp.com/api/v1/songs/"+artist;
			// call AsynTask to perform network operation on separate thread
			new HttpAsyncTask().execute(requestUrl);
		}
		
	}
    
    
}