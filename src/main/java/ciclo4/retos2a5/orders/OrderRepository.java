package ciclo4.retos2a5.orders;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

/**
 *
 * @author smadr
 */
@Repository
public class OrderRepository
{
    @Autowired
    private OrderRepositoryInterface repositoryInterface;

    
    @Autowired
    private MongoTemplate mongoTemplate;
    /**
    * 
    * @param id
    * @return 
    */
    public Optional<Order> getOrderById(Integer id)
    {
        return repositoryInterface.findById(id);
    }
    
    /**
    * 
    * @return 
    */
    public List<Order> getAllOrders()
    {
        return (List<Order>) repositoryInterface.findAll();
    }

    /**
     * 
     * @param order
     * @return 
     */
    public Order saveOrder(Order order)
    {
        return repositoryInterface.save(order);
    }

    /**
     * 
     * @param order 
     */
    public void deleteOrder(Order order)
    {
       repositoryInterface.delete(order);
    }
    
    /**
    * 
    * 
     * @param id
    */    
    public void deleteOrderById(Integer id)
    { 
        repositoryInterface.deleteById(id);
    } 

    /**
    * 
    * 
     * @return 
    */     
    public Optional<Order> lastOrderId()
    {
        return repositoryInterface.findTopByOrderByIdDesc();
    }

    /**
    * 
    * 
     * @param zone
     * @return 
    */     
    public List<Order> getOrdersByZone(String zone)
    {
        return repositoryInterface.findByZone(zone);
    }

    
    /**
    * 
    * 
     * @param status
     * @return 
    */     
    public List<Order> getOrderByStatus(String status)
    {
        return repositoryInterface.findByStatus(status);
    }
    
    // MÉTODOS RETO 4:
    // Órdenes de un asesor
    public List<Order> ordersSalesManByID(Integer id)
    {
        Query query = new Query();
        
        Criteria criterio = Criteria
                            .where("salesMan.id")
                            .is(id);
        query.addCriteria(criterio);
        
        List<Order> orders = mongoTemplate.find(query, Order.class);
        
        return orders;
        
    }
    
    // Ordenes de un asesor x Estado
    public List<Order> ordersSalesManByState(String state, Integer id)
    {
        Query query = new Query();
        Criteria criterio = Criteria
                            .where("salesMan.id")
                            .is(id)
                            .and("status")
                            .is(state);
        
        query.addCriteria(criterio);
        
        List<Order> orders = mongoTemplate.find(query,Order.class);
        
        return orders;
    }
    
    // Ordenes de un asesor x fecha
    public List<Order> ordersSalesManByDate(String dateStr, Integer id)
    {
	DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        Query query = new Query();
        
        Criteria dateCriteria = Criteria.where("registerDay")
			.gte(LocalDate.parse(dateStr, dtf).minusDays(1).atStartOfDay())
			.lt(LocalDate.parse(dateStr, dtf).plusDays(1).atStartOfDay())
			.and("salesMan.id").is(id);
        
        query.addCriteria(dateCriteria);
        
        List<Order> orders = mongoTemplate.find(query,Order.class);
        
        return orders;       
    }
    
    
}
