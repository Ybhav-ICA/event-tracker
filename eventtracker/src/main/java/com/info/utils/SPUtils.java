package com.info.utils;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.SqlOutParameter;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.jdbc.object.SqlFunction;

import javax.sql.DataSource;
import java.sql.Types;
import java.util.*;


public class SPUtils {
    private static Logger log = LogManager.getLogger(SPUtils.class);

	//Sp Names for Event Management Questions
	public static final String LOGIN = "SP_UserLogin";
	public static final String GET_UserRoles = "SP_GetUserRoles";
	public static final String GET_States = "SP_GetStates";
	public static final String GET_Parliaments = "SP_GetParliaments";
	public static final String SP_CreateEventUser = "SP_CreateEventUser";
	public static final String SP_GetEventUsers = "SP_Get_MM_GM_Assignments";
	public static final String SP_DELETEUSER = "SP_EventUsers_Delete";
	public static final String SP_DELETEASSIGNEDCONSTITUENCY = "SP_EventUsers_MappingDelete";

	public static final String GET_LEADER_ROLES = "SP_Get_LeadersRoles";
	public static final String SAVE_EVENT = "SP_CreateEvent";
	public static final String GET_Request_Details = "SP_GetRequestDetails";

	public static final String GET_SAVED_ANSWERS = "SP_QuestionsGet";
	public static final String SAVE_SAMPLE = "SP_ModifyInvitationResponse";
	public static final String GET_EVENTS = "SP_Get_Events";
	public static final String GET_SUBMITTED_FORMS = "SP_GetAnalystResponseDetails";
	public static final String SAVE_REPORT = "SP_ModifyAnalystResponse";
	public static final String GET_MAIL_IDS = "SP_SendMailInvitations";
	public static final String GET_ANALYST_REPORT = "SP_Print_AnalystResponse";
	public static final String SP_DELETEEVENT = "SP_Event_Delete";


	public static final String CS_SP_ExportConfigGet = "SP_ExportConfigGet";
	public static final String CS_Export_SPWrapper = "Export_SPWrapper";
	public static final String CS_Download_File = "SP_Download_File";



	public static Map<String, SimpleJdbcCall> spCalls = new HashMap<String, SimpleJdbcCall>();

    public static SimpleJdbcCall getSPCall(String key, DataSource ds, String spName, String packageName,
                                           Map<String, RowMapper<?>> cursorMappers, Map<String, Integer> outputParams) {
        SimpleJdbcCall spCall = spCalls.get(key);
        if (spCall == null) {
            spCall = new SimpleJdbcCall(ds).withProcedureName(spName);
            // Set SP package Name to be executed
            if (packageName != null && packageName.length() > 0)
                spCall.withCatalogName(packageName);

            //spCall.withSchemaName("inctrl");
            spCall.getJdbcTemplate().setQueryTimeout(240);
            //TODO: Need more flexibility to support multiple cursors
            for (String cursorName : cursorMappers.keySet()) {
                RowMapper<?> mapper = cursorMappers.get(cursorName);
                spCall.returningResultSet(cursorName, mapper);
            }


            // Declare Output Parameters
            for (Map.Entry<String, Integer> entry : outputParams.entrySet())
                spCall.declareParameters(new SqlOutParameter(entry.getKey(), entry.getValue()));


            // This SP is now compiled and looked up for metadata, add to cahce to be reused later
            spCalls.put(key, spCall);
        }

        return spCall;
    }

    @SuppressWarnings({"unchecked", "rawtypes"})
    public static List execute(DataSource ds, String packageName, String spName,
                               MapSqlParameterSource inputParams, Map<String, Integer> outputParams,
                               String cursorName, RowMapper<?> rowMapper) {
        Map<String, RowMapper<?>> cursorMappers = new HashMap<String, RowMapper<?>>();
        if (rowMapper != null)
            cursorMappers.put(cursorName, rowMapper);

        Map<String, Object> m = executeMultiple(ds, packageName, spName, inputParams, outputParams, cursorMappers);

        List<Object> results = new LinkedList<Object>();
        results = (List<Object>) m.get(cursorName);
        return results;
    }


    // Use the multiple method to call SP with multiple cursors
    @SuppressWarnings({"unchecked", "rawtypes"})
    public static Map<String, Object> executeMultiple(DataSource ds, String packageName, String spName,
                                                      MapSqlParameterSource inputParams, Map<String, Integer> outputParams,
            /*expects a map with cursorname --> rowmapper*/Map<String, RowMapper<?>> cursorMappers) {
        String key = packageName + "." + spName;//+rowMapper.getClass().getName();
        for (String cursorName : cursorMappers.keySet()) {
            RowMapper<?> mapper = cursorMappers.get(cursorName);
            key += mapper.getClass().getName();
        }

		
		
		// Get the compiled SP
		SimpleJdbcCall spCall = getSPCall(key, ds, spName, packageName, cursorMappers, outputParams);
		//spCall.getJdbcTemplate().setFetchSize(0);

		logSPParameters(inputParams, outputParams, key);
		long startTime = 0;
		long endTime = 0;
		if( log.isDebugEnabled() )
			startTime = System.currentTimeMillis();


		Map<String, Object> m = null;
		if(inputParams != null)
			m = (Map<String, Object>) spCall.execute(inputParams);
		else
			m = (Map<String, Object>) spCall.execute( new HashMap<String, Object>() );

		if( log.isDebugEnabled() )
		{
			endTime = System.currentTimeMillis();
			log.info("Time for execution of SP "+ key + " is " + (endTime-startTime)/1000 +" seconds.");
		}
		
		return m;
	}

	public static Map<String, Integer> getDefaultOutputParams(String cursorName, String errorCodeName, String statusMessageName)
	{
		Map<String, Integer> outputParams = new HashMap<String, Integer>();
		
		outputParams.put(cursorName, Types.REF_CURSOR);
		outputParams.put(errorCodeName, Types.INTEGER);
		outputParams.put(statusMessageName, Types.VARCHAR);

		return outputParams;
	}

    public static Map<String, Integer> getOnlyCursorOutputParams(String cursorName)
    {
        Map<String, Integer> outputParams = new HashMap<String, Integer>();

        outputParams.put(cursorName, Types.REF_CURSOR);

        return outputParams;
    }

    public static Map<String, Integer> getEmptyOutputParams()
    {
        Map<String, Integer> outputParams = new HashMap<String, Integer>();

        return outputParams;
    }



    public static Map<String, Integer> getDefaultOutputParams2(String statusCode, String statusDesc)
	{
		Map<String, Integer> outputParams = new HashMap<String, Integer>();
		
		outputParams.put(statusCode, Types.VARCHAR);
		outputParams.put(statusDesc, Types.VARCHAR);

		return outputParams;
	}
	
	public static Map<String, Integer> getDefaultOutputParams3(String cursorName)
	{
		Map<String, Integer> outputParams = new HashMap<String, Integer>();
		
		outputParams.put(cursorName, Types.REF_CURSOR);

		return outputParams;
	}
	
	public static Map<String, Integer> getDefaultOutputParams4OutputParam(String cursorName, String errorCodeName, String statusMessageName,String effectedPUGCount)
	{
		Map<String, Integer> outputParams = new HashMap<String, Integer>();
		outputParams.put(cursorName, Types.REF_CURSOR);
		outputParams.put(errorCodeName, Types.INTEGER);
		outputParams.put(statusMessageName, Types.VARCHAR);
		outputParams.put(effectedPUGCount, Types.INTEGER);

		return outputParams;
	}

	
	public static MapSqlParameterSource spInputParameters()
	{
		MapSqlParameterSource in = new MapSqlParameterSource();
		return in;
	}

	public static void logSPParameters(MapSqlParameterSource inputParams, Map<String, Integer> outputParams, String spName)
	{
		if(log.isDebugEnabled())
		{
			log.debug("Executing SP: "+spName+" with the below Parameters.");

			log.debug("Input:");
			if(inputParams != null)
			{
				Map<String, Object> inpMap = inputParams.getValues();
				for(Map.Entry<String, Object> entry : inpMap.entrySet())
				{
					log.debug(entry.getKey()+" = "+ entry.getValue());
				}
			}

			log.debug("Output:");
			if(outputParams != null)
			{
				for(Map.Entry<String, Integer> entry : outputParams.entrySet())
				{
					log.debug(entry.getKey()+" = "+ entry.getValue());
				}
			}
		}
	}

	public static Map<String, Integer> getSaveUpdateOutput( String errorCodeName, String statusMessageName, String id)
	{
		Map<String, Integer> outputParams = new HashMap<String, Integer>();
		outputParams.put(errorCodeName, Types.INTEGER);
		outputParams.put(statusMessageName, Types.VARCHAR);
		outputParams.put(id, Types.INTEGER);
		
		return outputParams;
	}
	public static Map<String, Integer> getOutput( String errorCodeName, String statusMessageName, String outout)
	{
		Map<String, Integer> outputParams = new HashMap<String, Integer>();
		outputParams.put(errorCodeName, Types.INTEGER);
		outputParams.put(statusMessageName, Types.VARCHAR);
		outputParams.put(outout, Types.VARCHAR);
		
		return outputParams;
	}
	public static Map<String, Integer> getSaveUpdateOutput( String errorCodeName, String statusMessageName)
	{
		Map<String, Integer> outputParams = new HashMap<String, Integer>();
		outputParams.put(errorCodeName, Types.INTEGER);
		outputParams.put(statusMessageName, Types.VARCHAR);

		return outputParams;
	}
	
	@SuppressWarnings("unchecked")
	public static Long executeUpdateWithResultSet(DataSource ds, String packageName, String spName,
                                                  MapSqlParameterSource inputParams, Map<String, Integer> outputParams, String fetchKey
	)
	{
		String key = packageName+"."+spName;
		SimpleJdbcCall spCall = spCalls.get(key);
		if(spCall == null)
		{
			spCall =  new SimpleJdbcCall(ds).withProcedureName(spName);
			// Set SP package Name to be executed
			if(packageName != null && packageName.length() > 0)
				spCall.withCatalogName(packageName);
			//spCall.withSchemaName("inctrl");			
			spCall.getJdbcTemplate().setQueryTimeout(240); 
			//spCall.returningResultSet(cursorName, rowMapper);

			// Declare Output Parameters
			for(Map.Entry<String, Integer> entry : outputParams.entrySet())
			{
				spCall.declareParameters(new SqlOutParameter(entry.getKey(), entry.getValue()));
			}

			// This SP is now compiled and looked up for metadata, add to cahce to be reused later
			spCalls.put(key, spCall);
		}



		List<Object> results = new ArrayList<Object>();
		logSPParameters(inputParams, outputParams, key);


		Map<String, Object> m = null;
		if(inputParams != null)
			m = (Map<String, Object>) spCall.execute(inputParams);
		else
			m = (Map<String, Object>) spCall.execute( new HashMap<String, Object>() );
		if(m.get(fetchKey) != null)
			return Long.parseLong(m.get(fetchKey).toString());
		
		return null;
		//return results;
	}
	
	@SuppressWarnings("unchecked")
	public static List executeUpdate(DataSource ds, String packageName, String spName,
                                     MapSqlParameterSource inputParams, Map<String, Integer> outputParams
	)
	{
		String key = packageName+"."+spName;
		SimpleJdbcCall spCall = spCalls.get(key);
		if(spCall == null)
		{
			spCall =  new SimpleJdbcCall(ds).withProcedureName(spName);
			// Set SP package Name to be executed
			if(packageName != null && packageName.length() > 0)
				spCall.withCatalogName(packageName);
				
			//spCall.withSchemaName("inctrl");			
			spCall.getJdbcTemplate().setQueryTimeout(240); 
			//spCall.returningResultSet(cursorName, rowMapper);

			// Declare Output Parameters
			for(Map.Entry<String, Integer> entry : outputParams.entrySet())
			{
				spCall.declareParameters(new SqlOutParameter(entry.getKey(), entry.getValue()));
			}

			// This SP is now compiled and looked up for metadata, add to cahce to be reused later
			spCalls.put(key, spCall);
		}



		List<Object> results = new ArrayList<Object>();
		logSPParameters(inputParams, outputParams, key);


		Map<String, Object> m = null;
		if(inputParams != null)
			m = (Map<String, Object>) spCall.execute(inputParams);
		else
			m = (Map<String, Object>) spCall.execute( new HashMap<String, Object>() );

		//results = (List<Object>) m.get(cursorName);
		return results;
	}
	@SuppressWarnings("unchecked")
	public static Map<String, Object> executeUpdateAddOrUpdateTags(DataSource ds, String packageName, String spName,
                                                                   MapSqlParameterSource inputParams, Map<String, Integer> outputParams
	)
	{
		String key = packageName+"."+spName;
		SimpleJdbcCall spCall = spCalls.get(key);
		if(spCall == null)
		{
			spCall =  new SimpleJdbcCall(ds).withProcedureName(spName);
			// Set SP package Name to be executed
			if(packageName != null && packageName.length() > 0)
				spCall.withCatalogName(packageName);
			//spCall.withSchemaName("inctrl");			
			spCall.getJdbcTemplate().setQueryTimeout(240); 
			//spCall.returningResultSet(cursorName, rowMapper);

			// Declare Output Parameters
			for(Map.Entry<String, Integer> entry : outputParams.entrySet())
			{
				spCall.declareParameters(new SqlOutParameter(entry.getKey(), entry.getValue()));
			}

			// This SP is now compiled and looked up for metadata, add to cahce to be reused later
			spCalls.put(key, spCall);
		}



		List<Object> results = new ArrayList<Object>();
		logSPParameters(inputParams, outputParams, key);


		Map<String, Object> m = null;
		if(inputParams != null)
			m = (Map<String, Object>) spCall.execute(inputParams);
		else
			m = (Map<String, Object>) spCall.execute( new HashMap<String, Object>() );

		//results = (List<Object>) m.get(cursorName);
		return m;
	}
	/*
	 * Use below method for no output cursor calls, just plain param based call
	 */
	@SuppressWarnings("unchecked")
	public static Map<String, Object> execute(DataSource ds, String packageName, String spName,
                                              MapSqlParameterSource inputParams, Map<String, Integer> outputParams
	)
	{
		String key = packageName+"."+spName;
		SimpleJdbcCall spCall = spCalls.get(key);
		if(spCall == null)
		{
			spCall =  new SimpleJdbcCall(ds).withProcedureName(spName);
			// Set SP package Name to be executed
			if(packageName != null && packageName.length() > 0)
				spCall.withCatalogName(packageName);
			//spCall.withSchemaName("inctrl");			
			spCall.getJdbcTemplate().setQueryTimeout(240); 
			//spCall.returningResultSet(cursorName, rowMapper);

			// Declare Output Parameters
			for(Map.Entry<String, Integer> entry : outputParams.entrySet())
			{
				spCall.declareParameters(new SqlOutParameter(entry.getKey(), entry.getValue()));
			}

			// This SP is now compiled and looked up for metadata, add to cahce to be reused later
			spCalls.put(key, spCall);
		}



		List<Object> results = new ArrayList<Object>();
		logSPParameters(inputParams, outputParams, key);


		Map<String, Object> m = null;
		if(inputParams != null)
			m = (Map<String, Object>) spCall.execute(inputParams);
		else
			m = (Map<String, Object>) spCall.execute( new HashMap<String, Object>() );

		//results = (List<Object>) m.get(cursorName);
		return m;
	}

	
	
	
	 public static int executeFunction(DataSource ds, String packageName, String funName){
		 SqlFunction func = new SqlFunction(ds, "SELECT "+packageName+"."+funName+" from dual");
		 return func.run();
	 }
	  
	
	public static String getCallSPStatement(final String pSPName,final int pParamCount )
	{
		StringBuffer callStmt = new StringBuffer("{ call ");
		callStmt.append(pSPName);
		callStmt.append("(");
		for(int i=0; i<pParamCount; i++)
		{
			if(i!=0) callStmt.append(",");
			callStmt.append("?");
		}
		callStmt.append(") }");
	
		return callStmt.toString();
	}
	
	/*public static String buildInStatement(final String[] input )
	{
		StringBuffer inStmt = new StringBuffer("(");
		
		for(int i=0; i<input.length; i++)
		{
			if(i==input.length-1){
				inStmt.append("'"+input[i]+"'");
			}else{
				inStmt.append("'"+input[i]+"',");
			}
			
		}
		
		inStmt.append(")");
	
		return inStmt.toString();
	}
	
	public static String getPreparedStatement(final String pSPName,final int pParamCount )
	{
		StringBuffer psStmt = new StringBuffer(pSPName);
		psStmt.append(" VALUES (");
		for(int i=0; i<pParamCount; i++)
		{
			if(i!=0) psStmt.append(",");
			psStmt.append("?");
		}
		psStmt.append(")");
	
		return psStmt.toString();
	}
	
	public static void dbCleanUp(ResultSet pRs, Statement pStmt, Connection pConn)
    {
        closeResultSet(pRs);
        closeStatement(pStmt);
        closeConnection(pConn);
    }

    public static void closeResultSet(ResultSet pRs)
    {
        try
        {
            if (pRs != null)
            {
            	pRs.close();
            	pRs=null;
            }
        }
        catch (SQLException e)
        {
        	//logger.error( "Error closing a DB ResultSet:", e);
        	
        }
    }

    public static void closeStatement(Statement pStmt)
    {
        try
        {
            if (pStmt != null)
            {
            	pStmt.close();
            	pStmt=null;
            }
        }
        catch (SQLException e)
        {
        	//logger.error( "Error closing a DB Statement:" , e);
        	
        }
    }

    public static void closeConnection(Connection pConn)
    {
        if (pConn != null)
        {
            try
            {
                pConn.close();
            	pConn=null;
                 
            }
            catch (SQLException e)
            {
            	//logger.error( "Error closing a connection:", e);
            	
            }
        }
     }
    
   

	public static void setFetchSize(ResultSet rs, int rowcount) throws SQLException{
		if(rowcount>50000){
			rs.setFetchSize(5000);
		}else if(rowcount>5000){
			rs.setFetchSize(1000);
		}else if(rowcount>1000){
			rs.setFetchSize(500);
		}else{
			rs.setFetchSize(100);
		}
	}*/

}
