package ciclo4.retos2a5;

import ciclo4.retos2a5.clone.CloneRepositoryInterface;
import ciclo4.retos2a5.orders.OrderRepositoryInterface;
import ciclo4.retos2a5.user.UserRepositoryInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Retos2a5Application implements CommandLineRunner
{
    @Autowired
    private UserRepositoryInterface userCrud;
    @Autowired
    private CloneRepositoryInterface cloneCrud;
    @Autowired
    private OrderRepositoryInterface orderCrud;

    public static void main(String[] args) {
            SpringApplication.run(Retos2a5Application.class, args);
    }
    
    @Override
    public void run(String... args) throws Exception
    {
        userCrud.deleteAll();
        cloneCrud.deleteAll();
        orderCrud.deleteAll();
    }

}
