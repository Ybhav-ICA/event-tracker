package com.info.modules.login.dao;

import com.info.modules.exceptions.GlobalException;
import com.info.modules.login.vo.LoginRMVO;
import com.info.modules.login.vo.LoginStatusVO;
import com.info.modules.login.vo.LoginUserVO;
import com.info.modules.login.vo.RolesVO;
import com.info.utils.SPUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.ResultSetMetaData;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class LoginDAO {
    private final Logger log = LoggerFactory.getLogger(this.getClass());

    @Autowired
    @Qualifier("dataSource")
    private DataSource dataSource;

    public LoginRMVO login(String userName, String password) throws GlobalException {
        LoginRMVO rs = new LoginRMVO();

        try {
            Map<String, RowMapper<?>> loginMappers = new HashMap<String, RowMapper<?>>();

            loginMappers.put("#result-set-2", (resultSet, i) -> {
                        ResultSetMetaData rsmd = resultSet.getMetaData();
                        int columnCount = rsmd.getColumnCount();
                        LoginStatusVO vo = new LoginStatusVO();
                        if (columnCount > 1) {
                            vo.setMessage(resultSet.getString("Comments"));
                            vo.setStatus(resultSet.getBoolean("Status"));
                        }
                        return vo;
                    }
            );

            loginMappers.put("#result-set-1", (resultSet, i) -> {
                        ResultSetMetaData rsmd = resultSet.getMetaData();
                        int columnCount = rsmd.getColumnCount();
                        LoginUserVO user = new LoginUserVO();
                        if (columnCount > 1) {
                            user.setId(resultSet.getLong("Id"));
                            user.setName(resultSet.getString("FullName"));
                            user.setUserName(resultSet.getString("UserName"));
                            user.setRole(new RolesVO(resultSet.getLong("RoleId"), resultSet.getString("RoleName")));
                            user.setRoleId(resultSet.getLong("RoleId"));
                            user.setRoleName(resultSet.getString("RoleName"));
//                            user.setStateId(resultSet.getLong("StateId"));
//                            user.setActive(resultSet.getBoolean("Active"));
                        }
                        return user;
                    }
            );

            long startTime = System.currentTimeMillis();

            Map<String, Integer> outputParams = SPUtils.getEmptyOutputParams();
            MapSqlParameterSource inputParams = SPUtils.spInputParameters()
                    .addValue("username", userName)
                    .addValue("password", password);

            Map<String, Object> map = SPUtils.executeMultiple(dataSource, null, SPUtils.LOGIN, inputParams, outputParams, loginMappers);
            List user = (ArrayList) map.get("#result-set-1");
            List status = (ArrayList) map.get("#result-set-2");
            rs.setUser((LoginUserVO) user.get(0));
            rs.setStatus((LoginStatusVO) status.get(0));
            log.debug("SP call to Login took " + (System.currentTimeMillis() - startTime) + " milli seconds.");
        } catch (Exception e) {
            log.error("An error occurred while Login. Please contact the Support Team.", e);
            throw new GlobalException("An error occurred while Login. Please contact the Support Team.");
        }
        return rs;
    }
}
