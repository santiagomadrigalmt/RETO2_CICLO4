package ciclo4.retos2a5.orders;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

/**
 *
 * @author smadr
 */
@RestController
@RequestMapping("/order")
@CrossOrigin( origins = "*", methods= {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE} )
public class OrderWebController
{
    /**
     * Attribute OrderServices services
     * @author Santiago M. / Mintic
     */
    @Autowired
    private OrderServices services;    
    
    
    // ########## GET REQUESTS ##########

    /**
     * GET Method OrderById
     * @author Santiago M. / Mintic
     * @param orderId
     * @return The user who has the corresponding id.
     */
    @GetMapping("/{orderId:^[1-9][0-9]*$}")
    public Optional<Order> getOrderById(@PathVariable("orderId") Integer orderId)
    {
        return services.getOrderById(orderId);
    }
    
    /**
     * GET Method getUsers
     * @author Santiago M. / Mintic
     * @return List of users in the database.
     */
    @GetMapping("/all")
    public List<Order> getAllOrders()
    {
        return services.getAllOrders();
    }
    
    /**
     * GET Method getUsers
     * @author Santiago M. / Mintic
     * @param orderZone
     * @return List of users in the database.
     */
    @GetMapping("/zona/{orderZone:^[a-zA-Z0-9\\s]*$}")
    public List<Order> getOrdersByZone(@PathVariable("orderZone") String orderZone)
    {
        System.out.println("orderZone = " + orderZone);
        return services.getOrdersByZone(orderZone);
    }
    
    /**
     * GET Method getUsers
     * @author Santiago M. / Mintic
     * @param orderStatus
     * @return List of users in the database.
     */
    @GetMapping("/status/{orderStatus}")
    public List<Order> getOrdersByStatus(@PathVariable("orderStatus") String orderStatus)
    {
        return services.getOrderByStatus(orderStatus);
    }
    
    
    // ########## POST REQUESTS ##########
    
    /**
     * POST Method saveUser
     * @author Santiago M. / Mintic
     * @param order
     * @return Information of the saved user as a User object.
     */
    @PostMapping("/new")
    @ResponseStatus(HttpStatus.CREATED)
    public Order saveOrder(@RequestBody Order order)
    {
        return services.saveOrder(order);
    }    


    // ########## PUT REQUESTS ##########
    
    /**
     * PUT Method updateUser
     * @author Santiago M. / Mintic
     * @param order
     * @return Information of the updated user as a User object.
     */
    @PutMapping("/update")
    @ResponseStatus(HttpStatus.CREATED)
    public Order updateOrder(@RequestBody Order order)
    {
        return services.updateOrder(order);
    }
 
    /**
     * PUT Method updateUser
     * @author Santiago M. / Mintic
     * @param newStatus
     * @param order
     * @return Information of the updated user as a User object.
     */
    @PutMapping("/state/{newStatus}")
    @ResponseStatus(HttpStatus.CREATED)
    public Order updateOrderStatus(@PathVariable("newStatus") String newStatus, @RequestBody Order order)
    {
        order.setStatus(newStatus);
        return services.updateOrder(order);
    }
    
    
    // ########## DELETE REQUESTS ##########
    
    /**
     * DELETE Method deleteOrder
     * @author Santiago M. / Mintic
     * @param orderId
     * @return Returns TRUE if the delete was successful. Returns FALSE otherwise.
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public Boolean deleteOrderById(@PathVariable("id") Integer orderId)
    {
        return services.deleteOrderById(orderId);
    }    
    
}
