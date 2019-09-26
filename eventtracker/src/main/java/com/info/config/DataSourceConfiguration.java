package com.info.config;//package com.info.config;
//
//import com.zaxxer.hikari.HikariDataSource;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.context.annotation.Configuration;
//
//import javax.annotation.PostConstruct;
//import javax.sql.DataSource;
//
//@Configuration
//public class DatasourceConfiguration {
//
//    @Autowired
//    private DataSource dataSource;
//
//    @Autowired
//    private MetricRegistry metricRegistry;
//
//
//    @PostConstruct
//    public void setUpHikariWithMetrics() {
//        if(dataSource instanceof HikariDataSource) {
//            ((HikariDataSource) dataSource).setMetricRegistry(metricRegistry);
//        }
//    }
//}
