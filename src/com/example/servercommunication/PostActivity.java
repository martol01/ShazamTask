package com.example.servercommunication;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.json.JSONObject;

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

public class PostActivity extends Activity implements OnClickListener{

	TextView tvIsConnected;
    EditText etArtist,etTitle,etUrl;
    Button btnPost;
    Song song;
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.post_request);
		tvIsConnected = (TextView) findViewById(R.id.tvIsConnected);
        etArtist = (EditText) findViewById(R.id.etArtist);
        etTitle = (EditText) findViewById(R.id.etTitle);
        etUrl = (EditText) findViewById(R.id.etUrl);
        btnPost = (Button) findViewById(R.id.btnPost);
 
        // check if you are connected or not
        if(isConnected()){
            tvIsConnected.setBackgroundColor(0xFF00CC00);
            tvIsConnected.setText("You are conncted");
        }
        else{
            tvIsConnected.setText("You are NOT conncted");
        }
        btnPost.setOnClickListener(this);	
	}
	
	public static String POST(String url, Song song){
        InputStream inputStream = null;
        String result = "";
        try {
 
            // 1. create HttpClient
            HttpClient httpclient = new DefaultHttpClient();
 
            // 2. make POST request to the given URL
            HttpPost httpPost = new HttpPost(url);
 
            String json = "";
 
            // 3. build jsonObject
            JSONObject jsonObject = new JSONObject();
            jsonObject.accumulate("artist", song.getArtist());
            jsonObject.accumulate("title", song.getTitle());
            jsonObject.accumulate("url", song.getUrl());
 
            // 4. convert JSONObject to JSON to String
            json = jsonObject.toString();
 
            // ** Alternative way to convert Person object to JSON string usin Jackson Lib 
            // ObjectMapper mapper = new ObjectMapper();
            // json = mapper.writeValueAsString(person); 
 
            // 5. set json to StringEntity
            StringEntity se = new StringEntity(json);
 
            // 6. set httpPost Entity
            httpPost.setEntity(se);
 
            // 7. Set some headers to inform server about the type of the content   
            httpPost.setHeader("Accept", "application/json");
            httpPost.setHeader("Content-type", "application/json");
 
            // 8. Execute POST request to the given URL
            HttpResponse httpResponse = httpclient.execute(httpPost);
 
            // 9. receive response as inputStream
            inputStream = httpResponse.getEntity().getContent();
 
            // 10. convert inputstream to string
            if(inputStream != null)
                result = convertInputStreamToString(inputStream);
            else
                result = "Did not work!";
 
        } catch (Exception e) {
            Log.d("InputStream", e.getLocalizedMessage());
        }
 
        // 11. return result
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
	
	

	@Override
	public void onClick(View v) {
		switch(v.getId()){
        case R.id.btnPost:
            if(!validate())
                Toast.makeText(getBaseContext(), "Enter some data!", Toast.LENGTH_LONG).show();
            // call AsynTask to perform network operation on separate thread
            new HttpAsyncTask().execute("http://zasham.herokuapp.com/api/v1/songs");
        break;
    }
	}///DO GIT CLONE OF THE APP ON HEROKU - MUSIC GAME AND TEST THIS 
	private class HttpAsyncTask extends AsyncTask<String, Void, String> {
        @Override
        protected String doInBackground(String... urls) {
 
            song = new Song();
            song.setArtist(etArtist.getText().toString());
            song.setTitle(etTitle.getText().toString());
            song.setUrl(etUrl.getText().toString());
 
            return POST(urls[0],song);
        }
        // onPostExecute displays the results of the AsyncTask.
        @Override
        protected void onPostExecute(String result) {
            Toast.makeText(getBaseContext(), "Data Sent!", Toast.LENGTH_LONG).show();
       }
    }
 
    private boolean validate(){
        if(etArtist.getText().toString().trim().equals(""))
            return false;
        else if(etTitle.getText().toString().trim().equals(""))
            return false;
        else if(etUrl.getText().toString().trim().equals(""))
            return false;
        else
            return true;    
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
	

}
